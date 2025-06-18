/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} lastname
 * @property {string} username
 * @property {string} email
 * @property {string} registrationDate
 * @property {'USER'|'ADMIN'} role
 * @property {'ACTIVE'|'BLOCKED'} status
 */

/**
 * @typedef {User} AuthUser
 * @property {string} token
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} nombreUsuario
 * @property {string} contrasena
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} nombre
 * @property {string} apellidos
 * @property {string} nombreUsuario
 * @property {string} correo
 * @property {string} contrasena
 */

/**
 * @typedef {Object} Photo
 * @property {number} id
 * @property {number} userId
 * @property {string} username
 * @property {string} url
 * @property {string} description
 * @property {string} datePosted
 * @property {number} likesCount
 * @property {number} commentsCount
 * @property {boolean} userLiked
 */

/**
 * @typedef {Object} PhotoCreateRequest
 * @property {string} description
 * @property {File} imageFile
 * @property {string} nombreUsuario
 */

/**
 * @typedef {Object} Comment
 * @property {number} id
 * @property {number} userId
 * @property {string} username
 * @property {number} photoId
 * @property {string} content
 * @property {string} datePosted
 */

/**
 * @typedef {Object} CommentCreateRequest
 * @property {number} photoId
 * @property {string} content
 */

/**
 * @typedef {Object} Message
 * @property {number} id
 * @property {number} senderId
 * @property {string} senderUsername
 * @property {number} receiverId
 * @property {string} receiverUsername
 * @property {string} content
 * @property {string} dateSent
 * @property {'READ'|'UNREAD'} status
 */

/**
 * @typedef {Object} MessageCreateRequest
 * @property {number} receiverId
 * @property {string} content
 */

/**
 * @typedef {Object} Notification
 * @property {number} id
 * @property {number} userId
 * @property {'LIKE'|'COMMENT'|'MESSAGE'|'SYSTEM'} type
 * @property {string} content
 * @property {string} dateCreated
 * @property {boolean} read
 * @property {number} [relatedId]
 */

/**
 * @typedef {Object} Report
 * @property {number} id
 * @property {number} reporterId
 * @property {number} reportedId
 * @property {'PHOTO'|'COMMENT'|'MESSAGE'} contentType
 * @property {number} contentId
 * @property {string} reason
 * @property {string} dateReported
 * @property {'PENDING'|'REVIEWED'|'RESOLVED'} status
 */

/**
 * @typedef {Object} ReportCreateRequest
 * @property {number} reportedId
 * @property {'PHOTO'|'COMMENT'|'MESSAGE'} contentType
 * @property {number} contentId
 * @property {string} reason
 */

/**
 * @typedef {Object} PageResponse
 * @property {Array} content
 * @property {number} totalPages
 * @property {number} totalElements
 * @property {number} size
 * @property {number} number
 * @property {boolean} first
 * @property {boolean} last
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {any} [data]
 * @property {Array<string>} [errors]
 */