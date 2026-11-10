# Automatic discovery in the Titanium module directory

Use this during a native-module release or an explicit discovery-readiness task. The directory at [titaniumsdk.com/modules](https://titaniumsdk.com/modules) discovers repositories through GitHub search; it has no Showcase-style submission process.

## Check current rules

Consult the current official [curation policy](https://github.com/tidev/titaniumsdk.com/blob/main/docs/module-curation.md), [generator](https://github.com/tidev/titaniumsdk.com/blob/main/scripts/generate-community-modules.ts), [exclusion filter](https://github.com/tidev/titaniumsdk.com/blob/main/scripts/lib/community-filter.ts) and [refresh workflow](https://github.com/tidev/titaniumsdk.com/blob/main/.github/workflows/refresh-community-modules.yml). Recheck them when behavior changes; do not assume a past badge, author allowlist or schedule remains current.

The current automatic filters are:

- A public, non-archived repository that is not a fork.
- At least one GitHub topic: `titanium`, `titanium-module` or `titanium-sdk`.
- A language matching the generator's queries: Objective-C (`objc`), Swift, Java, Kotlin or JavaScript.
- At least one recognized directory at the default branch root: `android`, `ios` or legacy `iphone`. The generator tests these paths through the GitHub contents API.
- No match in the blocked or already-curated repository sets. An already-curated module uses its existing official listing rather than getting a duplicate community listing.

Descriptions improve the generated listing but are not an automatic inclusion filter. Release ZIPs, manifest quality and license are human-review criteria, not extra filters in the current automatic scrape.

Do not fabricate platform folders, add misleading language/topics, detach a fork or change visibility to make a repository pass. An Alloy widget without native platform directories does not meet this native-module discovery test. Report such cases for a maintainer decision instead of promising that topics fix them.

## Inspect and complete metadata

Resolve the intended repository from its remote before changing metadata:

```sh
SLUG=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
gh api "repos/$SLUG" --jq '{full_name,description,topics,private,archived,fork,language,default_branch}'
gh api "repos/$SLUG/contents" --jq '.[] | select(.type == "dir") | .name'
```

For an authorized release/discovery task, add missing accurate topics. Adding all three Titanium topics makes the purpose explicit; any one is sufficient for discovery. `--add-topic` preserves existing topics:

```sh
gh repo edit "$SLUG"   --add-topic titanium   --add-topic titanium-module   --add-topic titanium-sdk
```

Add a few truthful feature/platform topics when useful. A Mac Catalyst-only module should say `mac-catalyst` and `macos`, rather than implying that it runs on iPhone merely because its package lives under `ios/`.

Check GitHub's About description separately from the README. If empty or inaccurate, write a concise English sentence grounded in the README and released functionality: what the module does, its Titanium context and important platform limits. Preserve an existing accurate description. Apply the resulting sentence with `gh repo edit "$SLUG" --description "$DESCRIPTION"`, then read it back. Do not invent capabilities or fill an unknown description with generic marketing text.

For example: “Native macOS open and save panels for Titanium SDK apps running on Mac Catalyst.” Use the actual module's capabilities, not this example for every release. A homepage is optional; set one only when an appropriate public documentation/product URL is known and the task calls for it.

## Verify discovery

1. Read repository metadata back and verify the resulting topics/description. Confirm the default-branch platform paths exist remotely; local unpushed folders do not qualify.
2. Check GitHub search using the generator's topic and language filters. Scope by owner to keep the result readable, and verify the exact repository is returned:

```sh
REPO_OWNER=${SLUG%%/*}
gh api --method GET search/repositories   -f "q=titanium in:topics language:objc language:swift language:java language:kotlin language:javascript user:$REPO_OWNER"   -f per_page=100   --jq '{incomplete_results, repositories: [.items[].full_name]}'
```

Repeat with `titanium-module` or `titanium-sdk` when those are the topics used. Paginate if needed; an incomplete/truncated search is not evidence that a missing repository is excluded. A newly added topic may take time to reach GitHub search. Record a pending search result without repeatedly rewriting correct metadata.

3. Check current blocked/curated lists if the repository passes search but not the generator. A fork or archived repository remains excluded regardless of topic matches. Do not edit generated `registry/modules/community.json` by hand.
4. Distinguish **metadata ready**, **found by GitHub search**, **eligible for the scrape**, and **observed in the live directory**. The refresh workflow currently runs daily; wait for its successful regeneration and deployment before claiming the final state. Do not trigger an upstream workflow, open an issue/PR or contact maintainers without task authorization.

The generator labels any `ios/` or `iphone/` directory as iOS. For a Catalyst-only module, keep its actual runtime restriction prominent in the description and README; that badge alone does not establish iPhone compatibility.

## Human review and release readiness

Automatic discovery starts in **Unverified**, unless a maintainer's existing curation entry changes its tier. **Community** requires a person to review the repository against the current policy:

- Public GitHub releases with packaged ZIP assets.
- Parseable per-platform manifests containing `moduleid`, `version` and `minsdk`.
- An OSI-approved license.
- Evidence of maintenance within two years, or an explicit statement that the module is finished and works.

Check these as release-quality information and report gaps. Do not change curation/author allowlists or claim TiDev endorsement. **Official** means TiDev maintains the module; publishing your own release does not grant that status.
