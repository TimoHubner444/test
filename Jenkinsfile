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
                checkout 'https://github.com/TimoHubner444/test.git'
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

        stage('Run Tests') {
            steps {
                script {
                    // Voer de tests uit in de 'app' container, die is gedefinieerd in docker-compose.yml
                    // Als de tests al in de 'command' in je Compose file zitten, kan deze stap mogelijk worden overgeslagen
                    sh 'docker compose -f ${COMPOSE_FILE} exec -T app npm test'  // Pas dit aan naar je testcommando
                }
            }
        }

        stage('Tear Down Docker Compose') {
            steps {
                script {
                    // Stop en verwijder de containers, netwerken, enz. gedefinieerd in docker-compose.yml
                    sh 'docker compose -f ${COMPOSE_FILE} down'
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
