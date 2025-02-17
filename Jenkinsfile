pipeline {
    agent any

    environment {
        // Pad naar je docker-compose.yml bestand (meestal in de root van je repository)
        COMPOSE_FILE = 'infra/compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout de code van je repository
                git url: 'https://github.com/TimoHubner444/test.git', branch: 'main'
            }
        }

        stage('Set Up Docker Compose') {
            steps {
                script {
                    // Zorg ervoor dat Docker Compose is geïnstalleerd en up-to-date is
                    sh 'docker compose --version'
                }
            }
        }

        stage('Start Services with Docker Compose') {
            steps {
                script {
                    // Start de services gedefinieerd in docker-compose.yml
                    sh 'docker compose -f ${COMPOSE_FILE} up -d' // Start in detached mode
                }
            }
        }
    }

    post {
        always {
            // Extra schoonmaakwerk kan hier worden gedaan, zoals het verwijderen van ongebruikte Docker-images
            sh 'docker system prune -f'
        }
    }
}

