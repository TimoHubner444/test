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
    }    
}


