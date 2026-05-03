/**
 * SARTHI Explainer Layer
 * 
 * A structured explanation layer that works AFTER the rule-based engine.
 * It ONLY explains, structures, and improves clarity of resolver output.
 * It NEVER replaces dataset logic or generates new rules.
 * 
 * Priority: Dataset > Explainer > Fallback
 * Accuracy > Creativity | Clarity > Length | Trust > Intelligence
 */

import { resolveScenario } from './what-if-resolver';

export interface SarthiResponse {
  explanation: string;
  steps: string[];
  note: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  documents?: string[];
  links?: { label: string; url: string }[];
}

// Anti-repetition: Track recent response patterns to vary phrasing
const recentPatterns: string[] = [];
const MAX_PATTERN_HISTORY = 10;

/**
 * Main entry point. Takes a user query, runs it through the rule-based
 * resolver, then wraps the output in a clear, structured explanation.
 */
export async function askSarthi(userQuery: string): Promise<SarthiResponse> {
  const result = await resolveScenario(userQuery);

  // CASE 1: Dataset match (structured_steps provided)
  if (result.scenarioKey !== 'unknown') {
    return buildMatchedResponse(result, userQuery);
  }

  // CASE 2 / CASE 3: No dataset match — provide safe general guidance
  return buildFallbackResponse(userQuery);
}

/**
 * CASE 1: Dataset matched — convert resolver output into clear,
 * actionable explanation WITHOUT modifying the underlying logic.
 */
function buildMatchedResponse(
  result: ReturnType<typeof resolveScenario>,
  originalQuery: string
): SarthiResponse {
  const explanation = varyExplanation(result.answer, result.scenarioKey);

  const note = generateContextualNote(result.scenarioKey, result.trustConfidence);

  trackPattern(result.scenarioKey);

  return {
    explanation,
    steps: result.steps, // Steps are KEPT SAME — no logic change
    note,
    source: result.trustSource,
    confidence: result.trustConfidence,
    documents: result.documents.length > 0 ? result.documents : undefined,
    links: result.links.length > 0 ? result.links : undefined,
  };
}

/**
 * CASE 2/3: No match — provide general guidance without
 * fabricating government procedures.
 */
function buildFallbackResponse(userQuery: string): SarthiResponse {
  trackPattern('fallback');

  return {
    explanation: `Your question about "${trimQuery(userQuery)}" isn't covered in our verified database yet. Here's how you can get the right answer directly from official sources.`,
    steps: [
      'Visit the Election Commission of India website at eci.gov.in',
      'Call the ECI toll-free helpline: 1950',
      'Use the Voter Helpline App (available on Play Store / App Store)',
      'Visit your nearest District Election Office for in-person assistance',
    ],
    note: 'This response uses general guidance — please verify with official ECI sources for your specific situation.',
    source: 'Election Commission of India (general guidance)',
    confidence: 'low',
    links: [
      { label: 'Election Commission of India', url: 'https://eci.gov.in' },
      { label: 'National Voters Service Portal', url: 'https://www.nvsp.in' },
    ],
  };
}

/**
 * Anti-repetition: Slightly vary the explanation structure for
 * repeat intents while keeping the meaning identical.
 */
function varyExplanation(baseAnswer: string, scenarioKey: string): string {
  const recentCount = recentPatterns.filter(p => p === scenarioKey).length;

  if (recentCount === 0) {
    return baseAnswer;
  }

  // Add a contextual prefix to vary the response pattern
  const prefixes = [
    'Here\'s what you need to know: ',
    'Based on ECI guidelines: ',
    'The verified answer is: ',
  ];
  const prefix = prefixes[recentCount % prefixes.length];
  return prefix + baseAnswer;
}

/**
 * Generate a contextual note based on the scenario type and confidence level.
 */
function generateContextualNote(scenarioKey: string, confidence: string): string {
  const noteMap: Record<string, string> = {
    lost_voter_id: 'You can use 11 alternate IDs accepted by ECI if your EPIC is unavailable.',
    eligibility_age: 'The qualifying date for age is January 1 of the electoral roll revision year.',
    first_time_voter: 'Applications are typically processed within 2-3 weeks during revision periods.',
    register_online: 'Keep your reference number safe to track application status.',
    register_offline: 'Your local BLO can also visit your residence for verification.',
    documents_registration: 'Self-attested photocopies are generally accepted along with originals.',
    duplicate_epic: 'Processing time for duplicate EPIC is typically 15-30 days.',
    change_address: 'Address updates within the same constituency use Form 8A; cross-constituency moves need Form 6 + Form 7.',
    shifted_city: 'You cannot vote in two constituencies — the old entry must be deleted.',
    name_missing: 'Check both online and the physical voter list displayed at your local polling booth.',
    name_correction: 'Minor corrections are usually processed faster than major changes.',
    polling_booth: 'You can also use the Voter Helpline App to find your booth.',
    vote_anywhere: 'Postal ballot facility is available only for specific categories like service voters.',
    voting_time: 'Timings can vary by state — always check ECI notifications for your specific phase.',
    queue_rules: 'Polling officers issue tokens to everyone in queue before closing time.',
    mobile_restriction: 'Rules may vary by state election commission — follow local instructions.',
    nri_voting: 'Proxy voting for NRIs is under legislative consideration but not yet implemented.',
    senior_citizen: 'Postal ballot facility is available for voters aged 80+ and PwD voters.',
    fraud_vote: 'Tendered votes are sealed separately and counted only if challenged votes are disputed.',
    duplicate_registration: 'Multiple registrations can lead to legal action under electoral laws.',
    am_i_registered: 'You can also call 1950 or SMS to 1950 for voter list verification.',
    citizenship_requirement: 'Overseas Indians can register as electors using Form 6A.',
  };

  if (noteMap[scenarioKey]) {
    return noteMap[scenarioKey];
  }

  if (confidence === 'medium') {
    return 'This information may vary by state or election phase. Verify with your local election office.';
  }

  return 'Source verified from Election Commission of India official publications.';
}

/**
 * Track recent response patterns for anti-repetition.
 */
function trackPattern(key: string): void {
  recentPatterns.push(key);
  if (recentPatterns.length > MAX_PATTERN_HISTORY) {
    recentPatterns.shift();
  }
}

/**
 * Trim query for display in fallback messages.
 */
function trimQuery(query: string): string {
  const trimmed = query.trim();
  return trimmed.length > 60 ? trimmed.slice(0, 57) + '...' : trimmed;
}
