FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY proto-files /proto-files

COPY purchase/pom.xml .
COPY purchase/src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

LABEL maintainer="Vule"

COPY --from=build /app/target/purchase-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083
EXPOSE 50054

ENTRYPOINT ["java", "-jar", "app.jar"]