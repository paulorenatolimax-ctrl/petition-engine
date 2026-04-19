#!/bin/bash
# Test fixture for runClaude timeout tests.
# Ignores runClaude's injected args (-p <instruction> --allowedTools ...)
# and sleeps for the duration specified in $SLEEPER_DURATION (default 30s).
exec sleep "${SLEEPER_DURATION:-30}"
