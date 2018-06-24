BUILD_DIR := dist

.PHONY: build
build:
	mkdir -p ${BUILD_DIR} && \
		npm run build:production && \
		cp manifest.json ${BUILD_DIR} && \
		cp popup.html ${BUILD_DIR}

.PHONY: clean
clean:
	rm -rf ${BUILD_DIR}
