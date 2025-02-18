pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'frontend/Dockerfile'
        AWS_ECR_REPO = 'aws-account-id.dkr.ecr.region.amazonaws.com/my-repo'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/TimoHubner444/test.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build(DOCKER_IMAGE)
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    docker.image(DOCKER_IMAGE).inside {
                        sh ''
                    }
                }
            }
        }

        stage('Deploy to AWS') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Log in to AWS ECR
                    sh 'aws ecr get-login-password --region region | docker login --username AWS --password-stdin $AWS_ECR_REPO'
                    
                    // Push the Docker image to ECR
                    docker.image(DOCKER_IMAGE).push('latest')
                    
                    // Trigger AWS CodeDeploy or ECS deployment (if applicable)
                    sh 'aws deploy push --application-name my-app --s3-location s3://my-bucket/my-app.zip'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            mail to: 'devops@company.com',
                 subject: "Build Failed: ${currentBuild.fullDisplayName}",
                 body: "Something went wrong with the Jenkins build. Check Jenkins logs for more info."
        }
    }
}
