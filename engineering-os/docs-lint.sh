#!/usr/bin/env bash
# docs-lint.sh — guards the Engineering OS against structural rot.
# Exit non-zero on any violation. Run before every commit.
set -uo pipefail
cd "$(dirname "$0")"
errors=0

fail() { echo "  ✗ $1"; errors=$((errors+1)); }

echo "Linting Engineering OS…"

# 1. No colons in any path
if find . -name '*:*' | grep -q .; then
  fail "Colon found in a path (illegal on Windows):"
  find . -name '*:*' | sed 's/^/     /'
fi

# 2. No spaces in filenames
if find . -name '* *' -not -path './.git/*' | grep -q .; then
  fail "Space found in a filename:"
  find . -name '* *' -not -path './.git/*' | sed 's/^/     /'
fi

# 3. No empty markdown files
empty=$(find . -name '*.md' -empty)
if [ -n "$empty" ]; then
  fail "Empty markdown file(s):"
  echo "$empty" | sed 's/^/     /'
fi

# 4. Every markdown file has a metadata block
while IFS= read -r f; do
  if ! grep -qi 'Document Metadata\|Document Type' "$f"; then
    fail "Missing metadata block: $f"
  fi
done < <(find . -name '*.md')

# 5. No macOS cruft
if find . \( -name '.DS_Store' -o -path '*__MACOSX*' \) | grep -q .; then
  fail "macOS cruft present (.DS_Store / __MACOSX)"
fi

# 6. Bad examples must point to a good twin
for f in 30-build/examples/bad/*.md; do
  [ -e "$f" ] || continue
  grep -qi 'Do This Instead\|instead' "$f" || fail "Bad example lacks a 'Do This Instead' pointer: $f"
done

if [ "$errors" -eq 0 ]; then
  echo "✓ docs-lint passed — $(find . -name '*.md' | wc -l | tr -d ' ') documents clean."
  exit 0
else
  echo ""
  echo "✗ docs-lint failed with $errors error(s)."
  exit 1
fi
