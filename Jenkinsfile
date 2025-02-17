pipeline {
    agent any

    environment {
        COMPOSE_FILE = "infra/compose.yml"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/TimoHubner444/test.git'
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
                    // Wacht totdat MySQL klaar is
                    sleep 20
                }
            }
        }
     
        stage('Install Dependencies') {
            parallel {
                stage('Install Backend Dependencies') {
                    steps {
                        script {
                            // Installeer backend dependencies in de backend container
                            sh 'docker compose -f $COMPOSE_FILE exec backend npm install'
                        }
                    }
                }

                stage('Install Frontend Dependencies') {
                    steps {
                        script {
                            // Installeer frontend dependencies in de frontend container
                            sh 'docker compose -f $COMPOSE_FILE exec frontend npm install'
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        script {
                            // Voer de backend tests uit
                            sh 'docker compose -f $COMPOSE_FILE exec backend npm test -- --json --outputFile=test-results.json'
                        }
                    }
                }

                stage('Frontend Tests') {
                    steps {
                        script {
                            // Voer de frontend tests uit
                            sh 'docker compose -f $COMPOSE_FILE exec frontend npm test -- --json --outputFile=test-results.json'
                        }
                    }
                }
            }
        }

        stage('Archive Test Results') {
            steps {
                script {
                    // Archiveer testresultaten
                    archiveArtifacts artifacts: '**/test-results.json', allowEmptyArchive: true
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
            // Archiveren van artefacten
            archiveArtifacts artifacts: '**/test-results.json', allowEmptyArchive: true
        }
        failure {
            // Loggen bij mislukte builds
            echo 'De build is mislukt! Controleer de testresultaten voor details.'
        }
    }
}
