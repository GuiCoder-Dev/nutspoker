package com.nutspoker.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity(name = "blinds")
class BlindModel(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @Column(name = "level")
    var level: Int,

    @Column(name = "small_blind")
    var smallBlind: Int,

    @Column(name = "big_blind")
    var bigBlind: Int,

    @Column(name ="ante")
    var ante: Int,

    @Column(name ="duration")
    var duration: Int
)
