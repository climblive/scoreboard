package se.scoreboard.data.domain

import java.io.Serializable
import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "location")
open class Location (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    open var organizer: Organizer? = null,

    @Column(name = "name", nullable = false, length = 32)
    open var name: String? = null,

    @Column(name = "longitude", nullable = false, length = 8)
    open var longitude: String? = null,

    @Column(name = "latitude", nullable = false, length = 8)
    open var latitude: String? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "location")
    open var contests: MutableSet<Contest> = HashSet(0)) : Serializable, AbstractEntity<Int>