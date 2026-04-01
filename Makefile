.PHONY: implement

implement:
ifndef IMPL
	$(error IMPL is required. Usage: make implement IMPL=01-web-framework-benchmark-2026)
endif
	./scripts/ralph/ralph.sh --impl $(IMPL) --tool opencode 50
