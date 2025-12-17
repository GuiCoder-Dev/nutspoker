package com.nutspoker.controller

import com.nutspoker.controller.response.StartSessionResponse
import com.nutspoker.model.BlindModel
import com.nutspoker.repository.BlindRepository
import com.nutspoker.service.SessionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/session")
class SessionController(
    private val sessionService: SessionService,
) {

    @PostMapping("/start")
    fun startSession(): ResponseEntity<StartSessionResponse> {
        val sessionId = UUID.randomUUID().toString()
        val defaultBlinds = sessionService.generateDefaultBlinds(sessionId)
        return ResponseEntity.ok(StartSessionResponse(sessionId, defaultBlinds))
    }

    @GetMapping("/blinds")
    fun getBlinds(@RequestHeader("X-Session-Id") sessionId: String): ResponseEntity<List<BlindModel>> {
        val blinds = sessionService.getBlindsBySession(sessionId)
        return ResponseEntity.ok(blinds)
    }

    @PostMapping("/end")
    fun endSession(@RequestHeader("X-Session-Id") sessionId: String): ResponseEntity<Void> {
        sessionService.endSession(sessionId)
        return ResponseEntity.noContent().build()
    }


}