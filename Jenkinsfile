pipeline {
    agent any
    stages {
        stage('Checkout Git Repo') {
            steps {
                // Specificeer de branch hier
                git branch: 'main', url: 'https://github.com/TimoHubner444/test.git'
            }
        }
        stage('Hello World') {
            steps {
                echo 'Hello, World!'
            }
        }
    }
}
