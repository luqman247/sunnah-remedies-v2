/**
 * Phase 9 — Permission Resolver Tests
 *
 * Unit tests for role × tier × verification × suspension combinations.
 */

import {
  resolvePermissions,
  hasCapability,
  capabilitiesToArray,
} from "../../src/lib/permissions/resolver";
import type { MemberRole } from "../../src/modules/identity/roles";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function testVisitorHasPublicLibraryOnly() {
  const resolved = resolvePermissions({
    roles: [],
    tierKey: "free_registered",
  });

  assert(hasCapability(resolved, "library.read.public"), "Visitor gets public library");
  assert(!hasCapability(resolved, "campus.access"), "Visitor cannot access campus");
  console.log("✓ Visitor / unauthenticated defaults");
}

function testRegisteredUserBasics() {
  const resolved = resolvePermissions({
    roles: ["registered_user"],
    tierKey: "free_registered",
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "forum.post"), "Registered can post with conduct ack");
  assert(hasCapability(resolved, "course.enrol"), "Registered can enrol");
  assert(!hasCapability(resolved, "campus.access"), "Registered cannot access campus");
  console.log("✓ Registered user capabilities");
}

function testConductGateBlocksForumPost() {
  const resolved = resolvePermissions({
    roles: ["registered_user"],
    tierKey: "free_registered",
    conductAcknowledged: false,
  });

  assert(!hasCapability(resolved, "forum.post"), "No post without conduct ack");
  assert(hasCapability(resolved, "forum.read"), "Can still read forums");
  console.log("✓ Conduct acknowledgement gate");
}

function testStudentCampusAccess() {
  const resolved = resolvePermissions({
    roles: ["student"],
    tierKey: "student",
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "campus.access"), "Student gets campus");
  assert(hasCapability(resolved, "campus.ai_tutor"), "Student gets AI tutor");
  assert(hasCapability(resolved, "library.read.private"), "Student gets private library");
  console.log("✓ Student campus access");
}

function testGraduateAlumniCapabilities() {
  const resolved = resolvePermissions({
    roles: ["graduate"],
    tierKey: "free_registered",
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "alumni.network"), "Graduate gets alumni network");
  assert(hasCapability(resolved, "mentorship.offer"), "Graduate can offer mentorship");
  assert(hasCapability(resolved, "cpd.log"), "Graduate can log CPD");
  console.log("✓ Graduate / alumnus capabilities");
}

function testPractitionerPortal() {
  const resolved = resolvePermissions({
    roles: ["practitioner"],
    tierKey: "practitioner",
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "practitioner.portal"), "Practitioner portal access");
  assert(hasCapability(resolved, "practitioner.protocols"), "Clinical protocols");
  assert(hasCapability(resolved, "directory.list_self"), "Directory listing");
  assert(!hasCapability(resolved, "campus.access"), "Practitioner no campus unless student too");
  console.log("✓ Practitioner portal access");
}

function testFacultyCanMarkBeneficial() {
  const resolved = resolvePermissions({
    roles: ["faculty"],
    tierKey: "free_registered",
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "forum.mark_beneficial"), "Faculty marks beneficial");
  assert(hasCapability(resolved, "credential.issue"), "Faculty issues credentials");
  assert(hasCapability(resolved, "event.create"), "Faculty creates events");
  console.log("✓ Faculty authority capabilities");
}

function testModeratorScoped() {
  const resolved = resolvePermissions({
    roles: ["moderator"],
    tierKey: "free_registered",
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "moderation.act"), "Moderator can act");
  assert(!hasCapability(resolved, "governance.admin"), "Moderator not admin");
  console.log("✓ Moderator scoped permissions");
}

function testAdminFullGovernance() {
  const resolved = resolvePermissions({
    roles: ["admin"],
    tierKey: "free_registered",
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "governance.admin"), "Admin governance");
  assert(hasCapability(resolved, "moderation.act"), "Admin moderation");
  assert(hasCapability(resolved, "credential.issue"), "Admin credentials");
  console.log("✓ Admin full governance");
}

function testMultiRoleUnion() {
  const resolved = resolvePermissions({
    roles: ["student", "graduate"] as MemberRole[],
    tierKey: "student",
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "campus.access"), "Student role gives campus");
  assert(hasCapability(resolved, "alumni.network"), "Graduate role gives alumni");
  console.log("✓ Multi-role capability union");
}

function testSuspensionRemovesPosting() {
  const resolved = resolvePermissions({
    roles: ["registered_user"],
    tierKey: "free_registered",
    conductAcknowledged: true,
    suspendedCapabilities: ["forum.post", "forum.reply"],
  });

  assert(!hasCapability(resolved, "forum.post"), "Suspended cannot post");
  assert(hasCapability(resolved, "library.read.public"), "Integrity: public library remains");
  console.log("✓ Suspension subtracts capabilities");
}

function testIntegrityLedgerUngated() {
  const resolved = resolvePermissions({
    roles: [],
    tierKey: "free_registered",
    suspendedCapabilities: ["forum.read"],
  });

  assert(
    hasCapability(resolved, "library.read.public"),
    "Public library never paywalled"
  );
  assert(
    hasCapability(resolved, "comms.announcements"),
    "Announcements never paywalled"
  );
  console.log("✓ Integrity Ledger ungated capabilities");
}

function testTierEntitlementsUnion() {
  const resolved = resolvePermissions({
    roles: ["registered_user"],
    tierKey: "supporting_member",
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "library.read.private"), "Supporting tier private library");
  assert(hasCapability(resolved, "alumni.events"), "Supporting tier alumni events");
  console.log("✓ Tier entitlement union");
}

function testAdminGrantsExplicit() {
  const resolved = resolvePermissions({
    roles: ["registered_user"],
    tierKey: "free_registered",
    adminGrants: ["research.library"],
    conductAcknowledged: true,
  });

  assert(hasCapability(resolved, "research.library"), "Admin grant applied");
  console.log("✓ Explicit admin grants");
}

function testCapabilitiesToArraySorted() {
  const resolved = resolvePermissions({
    roles: ["registered_user"],
    tierKey: "free_registered",
    conductAcknowledged: true,
  });

  const caps = capabilitiesToArray(resolved);
  assert(caps.length > 0, "Has capabilities");
  assert(caps[0] <= caps[caps.length - 1], "Sorted alphabetically");
  console.log("✓ Capabilities serialisation");
}

function runAll() {
  testVisitorHasPublicLibraryOnly();
  testRegisteredUserBasics();
  testConductGateBlocksForumPost();
  testStudentCampusAccess();
  testGraduateAlumniCapabilities();
  testPractitionerPortal();
  testFacultyCanMarkBeneficial();
  testModeratorScoped();
  testAdminFullGovernance();
  testMultiRoleUnion();
  testSuspensionRemovesPosting();
  testIntegrityLedgerUngated();
  testTierEntitlementsUnion();
  testAdminGrantsExplicit();
  testCapabilitiesToArraySorted();
  console.log("\nAll Phase 9 permission resolver tests passed.");
}

runAll();
