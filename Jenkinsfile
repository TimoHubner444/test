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
                    git branch: 'main', url: 'https://github.com/your-username/your-repository.git'
                }
            }
        }
    }
}


