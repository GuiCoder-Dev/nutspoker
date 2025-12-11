package com.nutspoker.repository

import com.nutspoker.model.BlindModel
import org.springframework.data.jpa.repository.JpaRepository

interface BlindRepository: JpaRepository<BlindModel, Int>{
    fun findTopByOrderByLevelDesc(): BlindModel
}