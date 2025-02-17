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

        stage('Wait for Services to be Ready') {
            steps {
                script {
                    // Wacht een korte tijd zodat de containers volledig kunnen starten
                    sleep 30
                }
            }
        }

        stage('Wait for MySQL') {
            steps {
                script {
                    // Wacht totdat MySQL beschikbaar is voor verbinding
                    sh 'docker compose -f $COMPOSE_FILE exec backend wait-for-it mysql:3306 --timeout=30'
                }
            }
        }
     
        stage('Install Dependencies') {
            parallel {
                stage('Install Backend Dependencies') {
                    steps {
                        script {
                            // Installeer backend dependencies in een tijdelijke container
                            sh 'docker compose -f $COMPOSE_FILE run backend npm install'
                        }
                    }
                }

                stage('Install Frontend Dependencies') {
                    steps {
                        script {
                            // Installeer frontend dependencies in een tijdelijke container
                            sh 'docker compose -f $COMPOSE_FILE run frontend npm install'
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
