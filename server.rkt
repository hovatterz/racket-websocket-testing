(require json)
(require net/rfc6455)

(struct province (id name) #:mutable)

(define (province->jsexpr p)
  (hash 'id (province-id p)
        'name (province-name p)))

(define (ws-response type jsexpr-data)
  (jsexpr->string (hash 'type type 'data jsexpr-data)))

(define (create-province c data)
  (ws-send! c (ws-response "new province" (province->jsexpr (province 1 (hash-ref data 'name))))))

(define (error-handler c data)
  (ws-send! c "{ \"type\": \"error\", \"data\": { \"message\": \"The server does not handle that type of request.\" } }"))

(define handlers (hash "new province" create-province))

(define (receive-data c data)
  (define parsed (string->jsexpr data))
  (apply (hash-ref handlers (hash-ref parsed 'type 'no-type) (thunk error-handler))
         (list c (hash-ref parsed 'data #hash()))))

(define (connection-handler c state)
  (let loop ()
    (sync (handle-evt c (lambda _
                          (define m (ws-recv c #:payload-type 'text))
                          (unless (eof-object? m)
                            (begin (receive-data c m)
                                   (loop)))))))
  (ws-close! c))

(define stop-service
  (ws-serve #:port 8081 connection-handler))

(printf "Server running. Hit enter to stop service.\n")
(void (read-line))
(stop-service)
