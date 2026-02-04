# Project Workflow

## Guiding Principles

1. **The Plan is the Source of Truth:** All work must be tracked in `plan.md`
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` *before* implementation
3. **Test-Driven Development:** Write unit tests before implementing functionality
4. **High Code Coverage:** Aim for >80% code coverage for all modules
5. **User Experience First:** Every decision should prioritize user experience
6. **Non-Interactive & CI-Aware:** Prefer non-interactive commands. Use `CI=true` for tools (tests, linters) to ensure single execution. For manual verification, use local development commands (e.g., `pnpm run dev`). Use `docker compose up --build -d` only for the final verification step at the end of a task or phase.

## Track Lifecycle

All major work streams are organized into **Tracks**.

### Track Initialization Protocol

**Trigger:** When starting a new track.

1.  **Create Track Directory:** Create a new directory in `conductor/tracks/<track_id>/`.
2.  **Initialize Plan:** Create a `plan.md` in the track directory, outlining the phases and tasks.
3.  **Record Root SHA:** Capture the current commit SHA and record it in `conductor/tracks/<track_id>/metadata.json` as `track_root_sha`. This SHA will be used for squashing at the end of the track.
4.  **Register Track:** Add the track to `conductor/tracks.md`.
5.  **Initial Commit:** Commit the new track directory and the update to `tracks.md` with the message `conductor(track): Initialize <track_id>`.

## Task Workflow

All tasks follow a strict lifecycle:

### Standard Task Workflow

1. **Select Task:** Choose the next available task from `plan.md` in sequential order

2. **Mark In Progress:** Before beginning work, edit `plan.md` and change the task from `[ ]` to `[~]`

3. **Write Failing Tests (Red Phase):**
   - Create a new test file for the feature or bug fix.
   - Write one or more unit tests that clearly define the expected behavior and acceptance criteria for the task.
   - **CRITICAL:** Run the tests and confirm that they fail as expected. This is the "Red" phase of TDD. Do not proceed until you have failing tests.

4. **Implement to Pass Tests (Green Phase):**
   - Write the minimum amount of application code necessary to make the failing tests pass.
   - Run the test suite again and confirm that all tests now pass. This is the "Green" phase.

5. **Refactor (Optional but Recommended):**
   - With the safety of passing tests, refactor the implementation code and the test code to improve clarity, remove duplication, and enhance performance without changing the external behavior.
   - Rerun tests to ensure they still pass after refactoring.

6. **Verify Coverage:** Run coverage reports using the project's chosen tools. For example, in a Python project, this might look like:
   ```bash
   pytest --cov=app --cov-report=html
   ```
   Target: >80% coverage for new code. The specific tools and commands will vary by language and framework.

7. **Document Deviations:** If implementation differs from tech stack:
   - **STOP** implementation
   - Update `tech-stack.md` with new design
   - Add dated note explaining the change
   - Resume implementation

8. **Update Plan:**
   - Read `plan.md`.
   - Find the line for the completed task.
   - Update its status from `[~]` to `[x]`.
   - Write the updated content back to `plan.md`.

9. **Commit Code & Plan:**
   - Stage all code changes related to the task AND the updated `plan.md`.
   - Propose a clear, concise commit message e.g, `feat(ui): Create basic HTML structure for calculator`.
   - Perform the commit.

10. **Attach Task Summary with Git Notes:**
   - **Step 10.1: Get Commit Hash:** Obtain the hash of the *just-completed commit* (`git log -1 --format="%H"`).
   - **Step 10.2: Draft Note Content:** Create a detailed summary for the completed task. This should include the task name, a summary of changes, a list of all created/modified files, and the core "why" for the change.
   - Use the `git notes` command to attach the summary to the commit.
     ```bash
     # The note content from the previous step is passed via the -m flag.
     git notes add -m "<note content>" <commit_hash>
     ```

11. **Push Changes:**
   - Execute `git push` to ensure your local changes are synchronized with the remote repository.

### Phase Completion Verification and Checkpointing Protocol

**Trigger:** This protocol is executed immediately after a task is completed that also concludes a phase in `plan.md`.

1.  **Announce Protocol Start:** Inform the user that the phase is complete and the verification and checkpointing protocol has begun.

2.  **Ensure Test Coverage for Phase Changes:**
    -   **Step 2.1: Determine Phase Scope:** To identify the files changed in this phase, you must first find the starting point. Read `plan.md` to find the Git commit SHA of the *previous* phase's checkpoint. If no previous checkpoint exists, the scope is all changes since the first commit.
    -   **Step 2.2: List Changed Files:** Execute `git diff --name-only <previous_checkpoint_sha> HEAD` to get a precise list of all files modified during this phase.
    -   **Step 2.3: Verify and Create Tests:** For each file in the list:
        -   **CRITICAL:** First, check its extension. Exclude non-code files (e.g., `.json`, `.md`, `.yaml`).
        -   For each remaining code file, verify a corresponding test file exists.
        -   If a test file is missing, you **must** create one. Before writing the test, **first, analyze other test files in the repository to determine the correct naming convention and testing style.** The new tests **must** validate the functionality described in this phase's tasks (`plan.md`).

3.  **Execute Automated Tests with Proactive Debugging:**
    -   Before execution, you **must** announce the exact shell command you will use to run the tests.
    -   **Example Announcement:** "I will now run the automated test suite to verify the phase. **Command:** `CI=true npm test`"
    -   Execute the announced command.
    -   If tests fail, you **must** inform the user and begin debugging. You may attempt to propose a fix a **maximum of two times**. If the tests still fail after your second proposed fix, you **must stop**, report the persistent failure, and ask the user for guidance.

4.  **Verification Protocol (Automated-First):**
    -   **CRITICAL:** You MUST prioritize automated verification (scripts, tests, linting) over manual steps.
    -   Manual verification steps should ONLY be proposed if automated verification is technically unfeasible or if a visual/UI confirmation is explicitly required.
    -   If you can verify the success of a task or phase using tools (e.g., checking file contents, running scripts, executing tests), you SHOULD do so and report the results rather than asking the user to perform the check.
    -   Only ask for user confirmation if there is ambiguity or a high-risk change that cannot be fully validated by tools.

5.  **Await Explicit User Feedback (Final Phase Only):**
    -   **CRITICAL:** In general, this manual step is ONLY required for the final phase of a track to ensure overall deliverable quality before archival. For intermediate phases, this step should be skipped unless a specific manual review is explicitly requested in the `plan.md`.
    -   **Final Phase Procedure:** After presenting the detailed plan, ask the user for confirmation: "**Does this meet your expectations? Please confirm with yes or provide feedback on what needs to be changed.**"
    -   **PAUSE** and await the user's response. Do not proceed without an explicit yes or confirmation.

6.  **Create Checkpoint Commit:**
    -   Stage all changes. If no changes occurred in this step, proceed with an empty commit.
    -   Perform the commit with a clear and concise message (e.g., `conductor(checkpoint): Checkpoint end of Phase X`).

7.  **Attach Auditable Verification Report using Git Notes:**
    -   **Step 7.1: Draft Note Content:** Create a detailed verification report including the automated test command, the manual verification steps, and the user's confirmation.
    -   **Step 7.2: Attach Note:** Use the `git notes` command and the full commit hash from the previous step to attach the full report to the checkpoint commit.

8.  **Get and Record Phase Checkpoint SHA:**
    -   **Step 8.1: Get Commit Hash:** Obtain the hash of the *just-created checkpoint commit* (`git log -1 --format="%H"`).
    -   **Step 8.2: Update Plan:** Read `plan.md`, find the heading for the completed phase, and append the first 7 characters of the commit hash in the format `[checkpoint: <sha>]`.
    -   **Step 8.3: Write Plan:** Write the updated content back to `plan.md`.

9. **Commit Plan Update:**
    - **Action:** Stage the modified `plan.md` file.
    - **Action:** Commit this change with a descriptive message following the format `conductor(plan): Mark phase '<PHASE NAME>' as complete`.

10.  **Announce Completion:** Inform the user that the phase is complete and the checkpoint has been created, with the detailed verification report attached as a git note.

### Track Completion Protocol

**Trigger:** This protocol is executed after the final phase of a track is completed and verified. **CRITICAL:** The track MUST NOT be squashed or archived until the final "Phase Completion Verification and Checkpointing Protocol" (which includes the mandatory "Await Explicit User Feedback" step) has been successfully completed for the last phase.

1.  **Preparation:**
    -   Ensure the final phase is completed and verified according to the "Phase Completion Verification and Checkpointing Protocol" (including obtaining explicit user approval for the entire track's deliverables).
    -   Identify the `track_root_sha` from `conductor/tracks/<track_id>/metadata.json`.

2.  **Consolidate Changes:**
    -   Move the track directory from `conductor/tracks/<track_id>/` to `conductor/archive/<track_id>/`.
    -   Update `conductor/tracks.md` to mark it as archived.
    -   Stage these moves and updates.

3.  **Squash Commits:**
    -   **CRITICAL:** Perform a soft reset to the track root: `git reset --soft <track_root_sha>`.
    -   All changes from the entire track (including the move to archive) are now staged.
    -   Commit all changes with a single, high-level commit message following Conventional Commits (e.g., `feat(<scope>): <Track Title>`).
    -   The commit message body MUST provide a concise, bulleted summary of all major features and fixes implemented in the track.

4.  **Final Verification:**
    -   Run the project's verification suite (e.g., `pnpm run check`) to ensure the squashed state is correct and stable.

5.  **Push and Announce:**
    -   Execute `git push --force-with-lease` (if on a feature branch) or `git push` as appropriate.
    -   Inform the user that the track has been successfully squashed, archived, and completed.

### Quality Gates

Before marking any task complete, verify:

- [ ] All tests pass
- [ ] Code coverage meets requirements (>80%)
- [ ] Code follows project's code style guidelines (as defined in `code_styleguides/`)
- [ ] All public functions/methods are documented (e.g., docstrings, JSDoc, GoDoc)
- [ ] Type safety is enforced (e.g., type hints, TypeScript types, Go types)
- [ ] No linting or static analysis errors (using the project's configured tools)
- [ ] Works correctly on mobile (if applicable)
- [ ] Documentation updated if needed
- [ ] No security vulnerabilities introduced

## Development Commands

**AI AGENT INSTRUCTION: This section should be adapted to the project's specific language, framework, and build tools.**

### Setup
```bash
pnpm install
```

### Daily Development
```bash
# Start the development server for manual verification
pnpm run dev

# Start the environment for final verification (at the end of a task/phase)
docker compose up --build -d

# Stop the environment
docker compose down

# Run tests
pnpm test

# Lint
pnpm run lint
```

### Before Committing
```bash
pnpm run check
```

## Testing Requirements

### Unit Testing
- Every module must have corresponding tests.
- Use appropriate test setup/teardown mechanisms (e.g., fixtures, beforeEach/afterEach).
- Mock external dependencies.
- Test both success and failure cases.

### Integration Testing
- Test complete user flows
- Verify database transactions
- Test authentication and authorization
- Check form submissions

### End-to-End (E2E) Testing
- Verify critical user journeys from start to finish.
- Ensure the application behaves correctly in a real browser environment.
- Capture screenshots or video on failure for debugging.
- **Goal:** Gain direct access to runtime errors and validate the full stack integration.

### Mobile Testing
- Test on actual iPhone when possible
- Use Safari developer tools
- Test touch interactions
- Verify responsive layouts
- Check performance on 3G/4G

## Code Review Process

### Self-Review Checklist
Before requesting review:

1. **Functionality**
   - Feature works as specified
   - Edge cases handled
   - Error messages are user-friendly

2. **Code Quality**
   - Follows style guide
   - DRY principle applied
   - Clear variable/function names
   - Appropriate comments

3. **Testing**
   - Unit tests comprehensive
   - Integration tests pass
   - Coverage adequate (>80%)

4. **Security**
   - No hardcoded secrets
   - Input validation present
   - SQL injection prevented
   - XSS protection in place

5. **Performance**
   - Database queries optimized
   - Images optimized
   - Caching implemented where needed

6. **Mobile Experience**
   - Touch targets adequate (44x44px)
   - Text readable without zooming
   - Performance acceptable on mobile
   - Interactions feel native

## Commit Guidelines

### Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks

### Examples
```bash
git commit -m "feat(auth): Add remember me functionality"
git commit -m "fix(posts): Correct excerpt generation for short posts"
git commit -m "test(comments): Add tests for emoji reaction limits"
git commit -m "style(mobile): Improve button touch targets"
```

## Definition of Done

A task is complete when:

1. All code implemented to specification
2. Unit tests written and passing
3. Code coverage meets project requirements
4. Documentation complete (if applicable)
5. Code passes all configured linting and static analysis checks
6. Works beautifully on mobile (if applicable)
7. Implementation notes added to `plan.md`
8. Changes committed with proper message
9. Git note with task summary attached to the commit
10. If completing a track: All commits squashed into a single feature commit according to the Track Completion Protocol

## Emergency Procedures

### Critical Bug in Production
1. Create hotfix branch from main
2. Write failing test for bug
3. Implement minimal fix
4. Test thoroughly including mobile
5. Deploy immediately
6. Document in plan.md

### Data Loss
1. Stop all write operations
2. Restore from latest backup
3. Verify data integrity
4. Document incident
5. Update backup procedures

### Security Breach
1. Rotate all secrets immediately
2. Review access logs
3. Patch vulnerability
4. Notify affected users (if any)
5. Document and update security procedures

## Deployment Workflow

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Coverage >80%
- [ ] No linting errors
- [ ] Mobile testing complete
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup created

### Deployment Steps
1. Merge feature branch to main
2. Tag release with version
3. Push to deployment service
4. Run database migrations
5. Verify deployment
6. Test critical paths
7. Monitor for errors

### Post-Deployment
1. Monitor analytics
2. Check error logs
3. Gather user feedback
4. Plan next iteration

## Continuous Improvement

- Review workflow weekly
- Update based on pain points
- Document lessons learned
- Optimize for user happiness
- Keep things simple and maintainable
