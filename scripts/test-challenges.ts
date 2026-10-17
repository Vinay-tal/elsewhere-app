import {
  getAllChallenges,
  getChallengeById,
  getChallengesByCategory,
  validateChallengeAnswer,
  calculateChallengeMetrics,
  getSavedChallenges,
  filterChallenges
} from '../src/lib/challengeService';
import { ChallengeType } from '../src/types';

function runTests() {
  console.log('🧪 Starting Elsewhere Challenges Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${msg}`);
      failed++;
    }
  }

  const all = getAllChallenges();

  // Test 1: Library size and structure
  console.log('Test 1: Library Size and Data Structure Integrity');
  assert(all.length >= 18, `Library contains at least 18 activities (found: ${all.length})`);
  assert(Boolean(getChallengeById('ch-logic-1')), 'getChallengeById correctly finds challenge by ID');
  all.forEach((ch) => {
    assert(Boolean(ch.id && ch.title), `Challenge ${ch.id} has ID and title`);
    assert(Boolean(ch.category && ch.difficulty), `Challenge ${ch.id} has category and difficulty`);
    assert(Boolean(ch.instructions && ch.instructions.length > 5), `Challenge ${ch.id} has clear instructions`);
    assert(Boolean(ch.prompt && ch.question), `Challenge ${ch.id} has prompt and question`);
    assert(Array.isArray(ch.options) && ch.options.length >= 2, `Challenge ${ch.id} has options`);
    assert(
      ch.correctOptionIndex >= 0 && ch.correctOptionIndex < ch.options.length,
      `Challenge ${ch.id} has valid correctOptionIndex (${ch.correctOptionIndex} in 0..${ch.options.length - 1})`
    );
    assert(Boolean(ch.hint && ch.hint.length > 5), `Challenge ${ch.id} has helpful hint`);
    assert(Boolean(ch.explanation && ch.explanation.length > 10), `Challenge ${ch.id} has detailed explanation`);
  });

  // Test 2: Category Coverage
  console.log('\nTest 2: Category Coverage Across All 6 Required Types');
  const requiredCategories: ChallengeType[] = ['quiz', 'logic', 'code', 'riddle', 'general', 'memory'];
  requiredCategories.forEach((cat) => {
    const subset = getChallengesByCategory(cat);
    assert(subset.length >= 3, `Category "${cat}" has at least 3 distinct challenges (found: ${subset.length})`);
  });

  // Test 3: Specialized Visual and Code fields
  console.log('\nTest 3: Specialized Visual Pattern and Code Snippet Support');
  const codeChallenges = all.filter((c) => c.category === 'code');
  assert(codeChallenges.length >= 3, `At least 3 code challenges exist`);
  codeChallenges.forEach((c) => {
    assert(Boolean(c.codeSnippet && c.codeSnippet.length > 0), `Code challenge ${c.id} contains codeSnippet`);
  });

  const memoryChallenges = all.filter((c) => c.category === 'memory');
  assert(memoryChallenges.length >= 3, `At least 3 memory challenges exist`);
  memoryChallenges.forEach((c) => {
    assert(
      Boolean(c.visualPattern && c.visualPattern.length > 0),
      `Memory challenge ${c.id} contains visualPattern matrix`
    );
  });

  // Test 4: Answer Validation
  console.log('\nTest 4: Answer Validation Logic & Educational Feedback');
  all.forEach((ch) => {
    const correctRes = validateChallengeAnswer(ch, ch.correctOptionIndex);
    assert(correctRes.isCorrect === true, `${ch.id}: correctOptionIndex passes validation`);
    assert(
      correctRes.correctOption === ch.options[ch.correctOptionIndex],
      `${ch.id}: correctOption text matches`
    );
    assert(correctRes.explanation === ch.explanation, `${ch.id}: explanation returned on validation`);

    const wrongIdx = (ch.correctOptionIndex + 1) % ch.options.length;
    const wrongRes = validateChallengeAnswer(ch, wrongIdx);
    assert(wrongRes.isCorrect === false, `${ch.id}: wrong option index fails validation as expected`);
  });

  // Test 5: Metrics and Deduplication
  console.log('\nTest 5: Cognitive Metrics and Deduplication on Retries');
  const mockCompletedIds = ['ch-logic-1', 'ch-code-1', 'ch-quiz-1'];
  const mockScores = {
    'ch-logic-1': { selected: 1, correct: true },
    'ch-code-1': { selected: 0, correct: true },
    'ch-quiz-1': { selected: 2, correct: false },
  };

  const metrics1 = calculateChallengeMetrics(mockCompletedIds, mockScores, all.length);
  assert(metrics1.completedCount === 3, `Completed count is 3`);
  assert(metrics1.correctCount === 2, `Correct count is 2`);
  assert(metrics1.accuracyPercentage === 67, `Accuracy is 67% (2/3)`);
  assert(metrics1.completionPercentage === Math.round((3 / all.length) * 100), `Completion percentage accurate`);

  // Retry simulation: user retries 'ch-quiz-1' and gets it right
  // The completion IDs list must NOT duplicate 'ch-quiz-1'
  const deduplicatedIds = Array.from(new Set([...mockCompletedIds, 'ch-quiz-1']));
  assert(deduplicatedIds.length === 3, `Retrying does not duplicate completedChallengeIds`);
  const retriedScores = {
    ...mockScores,
    'ch-quiz-1': { selected: 0, correct: true },
  };
  const metrics2 = calculateChallengeMetrics(deduplicatedIds, retriedScores, all.length);
  assert(metrics2.completedCount === 3, `Completed count remains 3 after retry`);
  assert(metrics2.correctCount === 3, `Correct count increases to 3 after successful retry`);
  assert(metrics2.accuracyPercentage === 100, `Accuracy rises to 100%`);

  // Test 6: Search & Filtering
  console.log('\nTest 6: Search & Filtering');
  const searchBayes = filterChallenges({ searchQuery: 'Bayes' });
  assert(searchBayes.length >= 1, `Search "Bayes" finds False Positive Paradox challenge`);

  const searchEverest = filterChallenges({ searchQuery: 'Everest' });
  assert(searchEverest.length >= 1, `Search "Everest" finds Mariana Trench challenge`);

  const quickChallenges = filterChallenges({ difficulty: 'Quick' });
  assert(quickChallenges.length > 0 && quickChallenges.every((c) => c.difficulty === 'Quick'), `Difficulty filtering works`);

  const savedIds = ['ch-logic-1', 'ch-mem-1'];
  const saved = getSavedChallenges(savedIds);
  assert(saved.length === 2, `getSavedChallenges finds exactly the 2 bookmarked challenges`);
  assert(saved.some((c) => c.id === 'ch-logic-1'), `Contains ch-logic-1`);
  assert(saved.some((c) => c.id === 'ch-mem-1'), `Contains ch-mem-1`);

  const savedFilterRes = filterChallenges({ savedOnly: true, savedIds });
  assert(savedFilterRes.length === 2, `filterChallenges with savedOnly=true filters correctly`);

  console.log(`\n========================================`);
  console.log(`🏁 Test Results: ${passed} passed, ${failed} failed.`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
