pipeline {
    agent any
    stages {
        stage('Checkout Git Repo') {
            steps {
                // Git repository uitchecken
                git 'https://github.com/TimoHubner444/test.git'
            }
        }
        stage('Hello World') {
            steps {
                echo 'Hello, World!'
            }
        }
    }
}
