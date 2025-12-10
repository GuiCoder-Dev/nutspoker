package com.nutspoker.service

import com.nutspoker.model.BlindModel
import com.nutspoker.repository.BlindRepository
import org.springframework.stereotype.Service

@Service
class SessionService(
    private val blindRepository: BlindRepository
) {

    fun generateDefaultBlinds(): List<BlindModel> {
        val configs = listOf(
            Triple(10, 20, 10),
            Triple(15, 30, 10),
            Triple(25, 50, 10),
            Triple(50, 100, 10),
            Triple(75, 150, 10),
            Triple(100, 200, 10),
            Triple(150, 300, 10),
            Triple(200, 400, 10),
            Triple(300, 600, 10),
            Triple(500, 1000, 10)
        )

        val defaultBlinds = configs.mapIndexed { index, (small, big, dur) ->
            BlindModel(
                level = index + 1,  // Auto: 1 a 10
                smallBlind = small,
                bigBlind = big,
                ante = 0,
                duration = dur
            )
        }
        val savedBlinds = blindRepository.saveAll(defaultBlinds)

        return savedBlinds.toList()
    }
}