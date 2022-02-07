package se.scoreboard.data.domain

import java.io.Serializable
import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "organizer")
open class Organizer (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @Column(name = "name", nullable = false, length = 32)
    open var name: String? = null,

    @Column(name = "homepage", length = 255)
    open var homepage: String? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "organizer")
    open var contests: MutableList<Contest> = mutableListOf(),

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "organizer")
    open var colors: MutableSet<Color> = HashSet(0),

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "organizer")
    open var locations: MutableSet<Location> = HashSet(0),

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "organizer")
    open var series: MutableSet<Series> = HashSet(0),

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_organizer", joinColumns = arrayOf(JoinColumn(name = "organizer_id", nullable = false, updatable = false)), inverseJoinColumns = arrayOf(JoinColumn(name = "user_id", nullable = false, updatable = false)))
    open var users: MutableSet<User> = HashSet(0)) : Serializable, AbstractEntity<Int>
