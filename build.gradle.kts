plugins {
	kotlin("jvm") version "1.9.25"
	kotlin("plugin.spring") version "1.9.25"
	id("org.springframework.boot") version "3.5.8"
	id("io.spring.dependency-management") version "1.1.7"
	kotlin("plugin.jpa") version "1.9.25"
}

group = "com.nutspoker"
version = "0.0.1-SNAPSHOT"
description = "Site de poker com sistema de blinds e tabelas"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	// JPA
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")

	// Spring Security
	//implementation("org.springframework.boot:spring-boot-starter-security")

	// Spring Validation
	implementation("org.springframework.boot:spring-boot-starter-validation")

	// MySQL e FlyWay
	runtimeOnly("com.mysql:mysql-connector-j")
	implementation("org.flywaydb:flyway-mysql:11.1.0")
	implementation("org.flywaydb:flyway-core:11.1.0")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.MappedSuperclass")
	annotation("jakarta.persistence.Embeddable")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
