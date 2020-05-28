install: install-deps

run:
	bin/gendiff.js

install-deps:
	npm ci

test:
	npm test

watch:
	npm test -- --watch

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

publish:
	npm publish --dry-run

.PHONY: test
