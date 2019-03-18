package se.scoreboard.data.domain

import java.io.Serializable
import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "user", uniqueConstraints = arrayOf(UniqueConstraint(columnNames = arrayOf("email"))))
open class User (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @Column(name = "name", nullable = false, length = 32)
    open var name: String? = null,

    @Column(name = "email", unique = true, nullable = false, length = 64)
    open var email: String? = null,

    @Column(name = "password", nullable = false, length = 60)
    open var password: String? = null,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_organizer",
            joinColumns = arrayOf(JoinColumn(name = "user_id", nullable = false, updatable = false)),
            inverseJoinColumns = arrayOf(JoinColumn(name = "organizer_id", nullable = false, updatable = false)))
    open var organizers: MutableSet<Organizer> = HashSet(0)) : Serializable, AbstractEntity<Int>