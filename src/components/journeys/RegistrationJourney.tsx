import type { RegistrationStep } from "@/lib/content/journeys/institution";

export function RegistrationJourney({ steps }: { steps: RegistrationStep[] }) {
  return (
    <ol className="enrolment-journey">
      {steps.map((step) => (
        <li key={step.step} className="enrolment-journey__step">
          <span className="enrolment-journey__numeral">{step.step}</span>
          <div>
            <h3 className="type-title enrolment-journey__title">{step.title}</h3>
            {step.duration && (
              <p className="type-micro enrolment-journey__duration">{step.duration}</p>
            )}
            <p className="type-body">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
