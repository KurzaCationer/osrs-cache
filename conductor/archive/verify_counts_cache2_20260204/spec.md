# Track Specification: Integration Test for Cache Asset Counts (cache2 Comparison)

**Overview**
To ensure the accuracy of our asset counting logic, we will implement a permanent automated integration test in the `@kurza/osrs-cache-loader` package. This test will fetch the latest OSRS cache from OpenRS2 and compare our counts against the results produced by the `cache2` package, which we will treat as the source of truth for asset counts.

**Functional Requirements**

1. **Direct `cache2` Integration:**
   - Integrate the `cache2` library as a dev-dependency for testing purposes.
2. **Latest Cache Verification:**
   - The test must fetch the latest "oldschool" cache ID from the OpenRS2 API at runtime.
3. **Comparative Testing:**
   - Implement a test that loads the cache using our `OpenRS2Client` and `Cache` class.
   - Load the same cache data (or metadata) using `cache2`.
   - Compare counts for all 16 categories defined in our `AssetCounts` interface.
4. **Source of Truth:**
   - Assume `cache2` counts are correct. The test should fail if our loader's counts do not match `cache2`'s findings for any overlapping category.

**Non-Functional Requirements**

- **Permanent Artifact:** The test should be part of the standard test suite (or a dedicated integration test command).
- **Network Dependency:** The test will require internet access to communicate with OpenRS2.

**Acceptance Criteria**

- A new integration test file is created (e.g., `packages/osrs-cache-loader/src/cache2-comparison.test.ts`).
- The test successfully fetches the latest cache ID.
- The test verifies that our counts match `cache2` for all supported categories.
- The test passes in the current environment.

**Out of Scope**

- Modifying the `cache2` library.
- Implementing local file-system cache loading (still focusing on OpenRS2-hosted data).
