pipeline {
    agent any

    environment {
        COMPOSE_FILE = "infra/compose.yml"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/TimoHubner444/test.git'  // Pas dit aan naar je eigen repo
            }
        }

        stage('Start Services') {
            steps {
                script {
                    // Start de services met docker-compose
                    sh 'docker compose -f $COMPOSE_FILE up -d'
                }
            }
        }

        stage('Wait for MySQL') {
            steps {
                script {
                    // Wacht totdat MySQL klaar is (optioneel, afhankelijk van healthcheck)
                    sleep 20
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        script {
                            // Backend tests uitvoeren met Maven binnen de container
                            sh 'docker compose -f $COMPOSE_FILE exec -T backend mvn test | tee target/test-results.log'
                        }
                    }
                }

                stage('Frontend Tests') {
                    steps {
                        script {
                            // Frontend tests uitvoeren met npm binnen de container
                            sh 'docker compose -f $COMPOSE_FILE exec -T frontend npm test -- --json --outputFile=test-results.json'
                        }
                    }
                }
            }
        }

        stage('Archive Test Results') {
            steps {
                script {
                    // Archiveer testresultaten (logbestanden)
                    archiveArtifacts artifacts: '**/target/test-results.log, **/test-results.json', allowEmptyArchive: true
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Stop de Docker Compose services
                    sh 'docker compose -f $COMPOSE_FILE down'
                }
            }
        }
    }

    post {
        always {
            // Zorg ervoor dat je artefacten en logs altijd worden opgeslagen
            archiveArtifacts artifacts: '**/target/test-results.log, **/test-results.json', allowEmptyArchive: true
        }
        failure {
            // Fouten loggen bij mislukte builds
            echo 'De build is mislukt! Controleer de testresultaten voor details.'
        }
    }
}
