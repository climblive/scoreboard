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

    @Column(name = "name", nullable = false, length = 32, unique = true)
    open var name: String? = null,

    @Column(name = "rgb_primary", length = 7, nullable = false)
    open var rgbPrimary: String? = null,

    @Column(name = "rgb_secondary", length = 7, nullable = true)
    open var rgbSecondary: String? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "color")
    open var problems: MutableSet<Problem> = HashSet(0)) : Serializable, AbstractEntity<Int>