FROM owasp/dependency-check-action:latest
LABEL repository="https://github.com/morrro01/owasp-dependency-scan-action-lnrsg" \
    homepage="https://github.com/morrro01/owasp-dependency-scan-action-lnrsg" \
    maintainer="morrro01" \
    com.github.actions.name="OWASP Dependency Scan Action" \
    com.github.actions.description="GitHub action for generating an OWASP dependency scan." \
    com.github.actions.icon="shield" \
    com.github.actions.color="green"
USER root
RUN apk add --update nodejs
COPY ./lib /action
ENTRYPOINT [ "node", "/action/index.js" ]