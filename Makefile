PROJECT_NAME := "be-transaction"

.PHONY: all

all:

resync-db: migration-drop migration-db migration-run
	@echo '==done=='

migration-db:
	@npx sequelize-cli db:create

migration-run:
	@npx sequelize-cli db:migrate:undo:all
	@npx sequelize-cli db:migrate
	@npx sequelize-cli db:seed:all --debug

migration-drop:
	@npx sequelize-cli db:drop

build:
	@docker build -t be-transaction:latest .

run:
	docker stop be-transaction; docker rm be-transaction; docker run -dit -p 8085:8085 --env-file=.env --name be-transaction be-transaction:latest