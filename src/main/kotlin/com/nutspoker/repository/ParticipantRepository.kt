package com.nutspoker.repository

import com.nutspoker.model.ParticipantModel
import org.springframework.data.jpa.repository.JpaRepository

interface ParticipantRepository: JpaRepository<ParticipantModel, Int> {
    fun deleteBySessionId(sessionId: String)
    fun findBySessionIdAndPositionIn(sessionId: String, positions: List<Int>): List<ParticipantModel>
}

