package se.scoreboard.data.domain

import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY
import java.io.Serializable

@Entity
@Table(name = "color")
open class Color (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @Column(name = "name", nullable = false, length = 32)
    open var name: String? = null,

    @Column(name = "red", nullable = false)
    open var red: Int = 0,

    @Column(name = "green", nullable = false)
    open var green: Int = 0,

    @Column(name = "blue", nullable = false)
    open var blue: Int = 0,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "color")
    open var problems: MutableSet<Problem> = HashSet(0)) : Serializable, AbstractEntity<Int>