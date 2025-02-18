pipeline {
    agent any

    environment {
        // Pad naar je docker-compose.yml bestand (meestal in de root van je repository)
        COMPOSE_FILE = 'infra/compose.yml'
    }

      stages {
        stage('Checkout') {
            steps {
                script {
                    // Checkout the main branch from your Git repository
                    git branch: 'main', url: 'https://github.com/TimoHubner444/test.git'
                }
            }
        }
          stage('Start Services') {
            steps {
                script {
                    sh 'docker compose -f infra/compose.yml up -d'
                }
            }
        }
          stage('Install Dependencies') {
            steps {
                script {
                    sh 'docker compose exec -T infra-frontend-1 npm install'
                }
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    sh 'docker compose exec -T infra-frontend-1 npm run test -- --watch=false --browsers=ChromeHeadless'
                }
            }
        }
        stage('E2E Tests') {
            steps {
                script {
                    sh 'docker compose exec -T infra-frontend-1 npm run e2e'
                }
            }
        }
    }
}


