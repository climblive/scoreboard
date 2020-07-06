FROM debian:buster
RUN apt-get -y update
RUN apt-get install -y openjdk-11-jdk-headless
RUN mkdir -p /opt/scoreboard/
ADD backend/build/libs/scoreboard-1.1.jar /opt/scoreboard/
CMD java -Dsun.misc.URLClassPath.disableJarChecking=true -jar /opt/scoreboard/scoreboard-1.1.jar
