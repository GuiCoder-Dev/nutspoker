package com.nutspoker.service

import com.nutspoker.model.BlindModel
import com.nutspoker.repository.BlindRepository
import org.springframework.stereotype.Service

@Service
class SessionService(
    private val blindRepository: BlindRepository
) {

    // Post
    fun generateDefaultBlinds(): List<BlindModel> {
        val configs = listOf(
            Pair(10,  10),
            Pair(15, 10),
            Pair(25,  10),
            Pair(50,  10),
            Pair(75, 10),
            Pair(0, 8), // break
            Pair(100,  10),
            Pair(150,  10),
            Pair(200,  10),
            Pair(300,  10),
            Pair(500,  10),
            Pair(0, 8), // break
            Pair(750, 10),
            Pair(1000, 10)
        )

        var levelCounter = 0
        val defaultBlinds = configs.map{(small, dur) ->
            if(small > 0) {
                levelCounter++
            }
            BlindModel(
                level = if (small > 0) levelCounter else 0,
                smallBlind = small,
                bigBlind = if (small > 0) small * 2 else 0,
                ante = 0,
                duration = dur
            )
        }

        val savedBlinds = blindRepository.saveAll(defaultBlinds)

        return savedBlinds.toList()
    }
}