---
name: ti-create-release
description: 'Use when preparing or publishing a GitHub release of a Titanium native module, building its platform ZIPs, checking release tags and assets, or configuring repository metadata for discovery in the Titanium module directory. Does not apply to App Store/Google Play releases or publishing Titanium SDK itself.'
---

# Release a Titanium native module

Publish the requested platform packages from a verified source commit, following the repository's release conventions. Also check its discoverability at titaniumsdk.com/modules. This workflow applies to any maintainer's module, including single-platform modules and maintained forks.

## Scope and authorization

Inspect the user's request before acting. A release-readiness review is read-only; preparing notes/artifacts does not imply publishing. An explicit release request authorizes its scoped publication and accurate discovery metadata updates without another generic confirmation. Resolve concrete ambiguities before the affected mutation, while completing independent preparation.

Do not publish app-store builds, Titanium SDK releases or a new TiTools version through this skill. Do not require an unrelated skill or a particular author's repository layout.

## 1. Establish the source and release convention

Read the repository instructions, README, platform manifests, build scripts/CI and recent releases. Identify the intended GitHub remote, default/release branch, requested platforms, version per platform and known build prerequisites.

```sh
SLUG=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
gh api "repos/$SLUG" --jq '{full_name,default_branch,private,archived,fork}'
gh release list --repo "$SLUG" --limit 10
git status --short
git remote -v
```

Inspect a representative prior release's tag, title, notes and asset names. Reuse a consistent established convention: some modules release each platform separately; others attach several platform ZIPs to one release. Neither pattern is universal. First releases need a concrete proposed convention grounded in the module's versions and requested scope.

Build from the intended merged default branch unless the user or repository specifies a release branch/commit. Fetch and inspect before switching or fast-forwarding. Preserve unrelated work; never reset, stash or commit it automatically. Use an isolated checkout/worktree when necessary to build the agreed commit without disturbing current work.

Record the full commit SHA before building. A movable branch name is not sufficient provenance. If a later tracked source edit is needed, commit it within authorization, select the resulting SHA and rebuild before release.

## 2. Check directory readiness

Read [Module discovery](references/module-discovery.md) before changing metadata. It covers current official discovery rules, additive topics, English About descriptions, GitHub search verification and human Community review.

A valid fork release may remain excluded from automatic discovery. Report that separately; directory exclusion alone does not block an otherwise valid authorized release. Do not detach forks, change visibility or fabricate native-platform folders to bypass filters.

## 3. Build and inspect the requested packages

Use the repository's documented build command and selected SDK/toolchain. Custom scripts may be required for Catalyst destinations, headers or package cleanup. Do not replace them with a guessed generic command. Standard module builds commonly run `ti build -p ios --build-only` or `ti build -p android --build-only` in the matching platform directory, but verify the installed builder and repository first.

- Build only the requested/supported platforms. Single-platform releases and independently versioned Android/iOS packages are valid when intended.
- Confirm fresh output from the recorded source SHA, rather than trusting an existing `dist/` ZIP. Serialize builds when they share generated inputs or output.
- Inspect ZIP integrity, packaged manifest, module ID, platform, version, minimum SDK and required native payload. Match the manifest inside the ZIP to the intended release, not just the filename.
- Apple packages conventionally use `iphone` in filenames even when the repository directory is `ios`. Preserve the actual builder output and platform scope, including Catalyst-only restrictions.
- Record each exact artifact path and SHA-256. Avoid wildcard uploads that can include stale versions.

If one requested build fails, fix it before publishing the affected release. Do not silently reduce scope, upload a stale platform package or claim that unbuilt platforms were released.

## 4. Prepare notes and resolve tag state

Follow the repository's established notes style. Describe the shipped platform changes, version/minimum-SDK changes and compatibility limits; link the relevant PR/commit when one exists. Do not require a PR for a direct committed release, mandate checkbox bullets or invent upstream dependency changes.

Write the exact notes to a temporary UTF-8 file and use `--notes-file`. Keep release history out of skill resources.

Distinguish an existing **Git tag** from an existing **GitHub release**. A release may legitimately be created for an existing tag, but first verify its remote peeled commit matches the built SHA. An existing release needs a separately authorized update; do not overwrite its assets or move tags as part of creating a new release. If immutable releases are enabled, published tags/assets cannot be replaced.

Choose draft/prerelease/latest behavior from the user's intent, semantic version and repository convention. Do not mark a beta stable or replace a newer stable Latest unintentionally. Check `gh release create --help` for the installed CLI behavior.

## 5. Publish the agreed release

Before publication, have the exact source SHA, tag/title, notes file, platform artifact paths/hashes and release flags ready. Publish only within the existing authorization. For a new tag, target the full built commit SHA. For an already verified remote tag, use `--verify-tag`.

Example shell invocation using prepared values and an explicit artifact list:

```sh
gh release create "$RELEASE_TAG" "${RELEASE_ASSETS[@]}" \
  --repo "$SLUG" \
  --target "$RELEASE_COMMIT" \
  --title "$RELEASE_TITLE" \
  --notes-file "$RELEASE_NOTES_FILE"
```

Set `RELEASE_ASSETS` to the exact requested ZIP paths. Add `--draft`, `--prerelease`, `--latest=false` or `--verify-tag` when the prepared plan requires them. Use one invocation per release grouping established above, rather than forcing one release per platform.

If an API/upload fails, inspect the resulting release and assets before retrying: failure does not prove that no remote release was created. Do not create a second tag or replace an existing artifact to hide a partial upload. Report a genuine permission/build/publication blocker with the prepared details.

## 6. Verify and report

Read the resulting release back. Verify its public/draft status, exact tag commit, requested asset names/sizes and downloaded SHA-256 against the built packages. Authentication may hide a private release's availability to strangers; report visibility accurately.

Follow [discovery verification](references/module-discovery.md#verify-discovery). Report these outcomes separately:

- Release URL(s), platforms/versions, source SHA and verified assets.
- Metadata changes, GitHub search eligibility and observed directory inclusion.
- Any build, visibility, indexing or upstream refresh limitation that remains.

A topic update or successful ZIP upload is not proof that the module is already listed or endorsed by TiDev. Do not trigger an upstream refresh or send a maintainer message without task authorization.

## Sources

- [GitHub CLI release creation](https://cli.github.com/manual/gh_release_create)
- [GitHub CLI release inspection](https://cli.github.com/manual/gh_release_view)
- [Titanium module discovery and curation](https://github.com/tidev/titaniumsdk.com/blob/main/docs/module-curation.md)

Repository build/release instructions determine module-specific commands and artifacts; the linked discovery reference routes to the current generator and filters.
