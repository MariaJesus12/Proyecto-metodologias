$(document).ready(function() {
    // Detectar página actual
    const path = window.location.pathname;
    let currentPage = '';
    if (path.includes('admin.html')) currentPage = 'admin';
    else if (path.includes('profesor.html')) currentPage = 'profesor';
    else if (path.includes('estudiante.html')) currentPage = 'estudiante';
    else if (path.includes('index.html')) currentPage = 'index';

    // --- Lógica de login y redirección (solo en index) ---
    if (currentPage === 'index') {
        $('#loginForm').submit(function(e) {
            e.preventDefault();
            $('#loginError').text('');
            $.ajax({
                url: 'backend/auth/login.php',
                type: 'POST',
                data: {
                    email: $('#loginEmail').val(),
                    password: $('#loginPassword').val()
                },
                success: function(response) {
                    if (response.includes('Login exitoso')) {
                        $.get('backend/auth/sesion.php', function(data) {
                            let sesion = {};
                            try { sesion = JSON.parse(data); } catch {}
                            if (sesion.logged && sesion.rol) {
                                if (sesion.rol === 'admin') window.location.href = 'admin.html';
                                else if (sesion.rol === 'profesor') window.location.href = 'profesor.html';
                                else window.location.href = 'estudiante.html';
                            } else {
                                $('#loginError').text('No se pudo determinar el rol.');
                            }
                        });
                    } else {
                        $('#loginError').text(response);
                    }
                },
                error: function() {
                    $('#loginError').text('Error en el servidor.');
                }
            });
        });
    }

    // --- Lógica para profesor ---
    if (currentPage === 'profesor') {
        function cargarEventos() {
            $.get('backend/eventos/listar_eventos.php', function(data) {
                let eventos = [];
                try { eventos = JSON.parse(data); } catch {}
                let html = '';
                eventos.forEach(ev => {
                    html += `
                    <tr>
                        <td>${ev.titulo}</td>
                        <td>${ev.fecha}</td>
                        <td>${ev.descripcion}</td>
                        <td>
                            <button class="btn btn-sm btn-info ver-inscritos" data-id="${ev.id}">Ver inscritos</button>
                            <button class="btn btn-sm btn-outline-secondary editar-evento" data-id="${ev.id}">Editar</button>
                            <button class="btn btn-sm btn-outline-danger eliminar-evento" data-id="${ev.id}">Eliminar</button>
                        </td>
                    </tr>`;
                });
                $('#eventos-tbody').html(html);
                $('#eventos-activos').text(eventos.length);
            });
        }
        cargarEventos();

        // Abrir modal para nuevo evento
        $('#add-event-btn').click(function() {
            $('#eventId').val('');
            $('#eventTitle').val('');
            $('#eventDescription').val('');
            $('#eventDate').val('');
            $('#eventModalLabel').text('Nuevo Evento');
            $('#eventModal').modal('show');
        });

        // Guardar evento (crear o editar)
        $('#eventForm').submit(function(e) {
            e.preventDefault();
            let id = $('#eventId').val();
            let url = id ? 'backend/eventos/editar_evento.php' : 'backend/eventos/crear_evento.php';
            $.post(url, {
                id: id,
                titulo: $('#eventTitle').val(),
                descripcion: $('#eventDescription').val(),
                fecha: $('#eventDate').val()
            }, function(resp) {
                alert(resp);
                $('#eventModal').modal('hide');
                cargarEventos();
            });
        });

        // Editar evento
        $(document).on('click', '.editar-evento', function() {
            let id = $(this).data('id');
            $.get('backend/eventos/listar_eventos.php', function(data) {
                let eventos = JSON.parse(data);
                let ev = eventos.find(e => e.id == id);
                if (ev) {
                    $('#eventId').val(ev.id);
                    $('#eventTitle').val(ev.titulo);
                    $('#eventDescription').val(ev.descripcion);
                    $('#eventDate').val(ev.fecha);
                    $('#eventModalLabel').text('Editar Evento');
                    $('#eventModal').modal('show');
                }
            });
        });

        // Eliminar evento
        $(document).on('click', '.eliminar-evento', function() {
            if (confirm('¿Seguro que deseas eliminar este evento?')) {
                let id = $(this).data('id');
                $.post('backend/eventos/eliminar_evento.php', {id: id}, function(resp) {
                    alert(resp);
                    cargarEventos();
                });
            }
        });
    }

    // --- Lógica para admin ---
    if (currentPage === 'admin') {
        function cargarEventos() {
            $.get('backend/eventos/listar_eventos.php', function(data) {
                let eventos = [];
                try { eventos = JSON.parse(data); } catch {}
                let html = '';
                eventos.forEach(ev => {
                    html += `
                    <tr>
                      <td>${ev.creado_por_nombre || ''}</td>
                        <td>${ev.titulo}</td>
                        <td>${ev.fecha}</td>
                        <td>${ev.descripcion}</td>
                      
                        <td>
                            <button class="btn btn-sm btn-outline-secondary editar-evento" data-id="${ev.id}">Editar</button>
                            <button class="btn btn-sm btn-outline-danger eliminar-evento" data-id="${ev.id}">Eliminar</button>
                        </td>
                    </tr>`;
                });
                $('#eventos-tbody').html(html);
                // Actualizar el contador de eventos activos si lo tienes
                $('#eventos-activos').text(eventos.length);
            });
        }
        cargarEventos();

        // Abrir modal para nuevo evento
        $('#add-event-btn').click(function() {
            $('#eventId').val('');
            $('#eventTitle').val('');
            $('#eventDescription').val('');
            $('#eventDate').val('');
            $('#eventModalLabel').text('Nuevo Evento');
            $('#eventModal').modal('show');
        });

        // Guardar evento (crear o editar)
        $('#eventForm').submit(function(e) {
            e.preventDefault();
            let id = $('#eventId').val();
            let url = id ? 'backend/eventos/editar_evento.php' : 'backend/eventos/crear_evento.php';
            $.post(url, {
                id: id,
                titulo: $('#eventTitle').val(),
                descripcion: $('#eventDescription').val(),
                fecha: $('#eventDate').val()
            }, function(resp) {
                alert(resp);
                $('#eventModal').modal('hide');
                cargarEventos();
            });
        });

        // Editar evento
        $(document).on('click', '.editar-evento', function() {
            let id = $(this).data('id');
            $.get('backend/eventos/listar_eventos.php', function(data) {
                let eventos = JSON.parse(data);
                let ev = eventos.find(e => e.id == id);
                if (ev) {
                    $('#eventId').val(ev.id);
                    $('#eventTitle').val(ev.titulo);
                    $('#eventDescription').val(ev.descripcion);
                    $('#eventDate').val(ev.fecha);
                    $('#eventModalLabel').text('Editar Evento');
                    $('#eventModal').modal('show');
                }
            });
        });

        // Eliminar evento
        $(document).on('click', '.eliminar-evento', function() {
            if (confirm('¿Seguro que deseas eliminar este evento?')) {
                let id = $(this).data('id');
                $.post('backend/eventos/eliminar_evento.php', {id: id}, function(resp) {
                    alert(resp);
                    cargarEventos();
                });
            }
        });
    }

    // --- Mostrar eventos para estudiante ---
    if (currentPage === 'estudiante') {
        function cargarEventosEstudiante() {
            // Primero obtenemos los eventos a los que el estudiante está inscrito
            $.get('backend/eventos/listar_eventos.php', function(data) {
                let eventos = [];
                try { eventos = JSON.parse(data); } catch {}

                // Ahora pedimos las inscripciones del estudiante
                $.get('backend/eventos/mis_inscripciones.php', function(inscData) {
                    let inscripciones = [];
                    try { inscripciones = JSON.parse(inscData); } catch {}

                    let html = '';
                    eventos.forEach(ev => {
                        let inscrito = inscripciones.includes(ev.id);
                        html += `
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${ev.titulo}</h5>
                                    <p class="card-text text-muted"><i class="fas fa-calendar-day me-2"></i>${ev.fecha}</p>
                                    <p class="card-text">${ev.descripcion}</p>
                                    <button class="btn btn-sm btn-outline-success inscribirse-btn" data-id="${ev.id}" ${inscrito ? 'disabled' : ''} style="display:${inscrito ? 'none' : 'inline-block'}">Inscribirse</button>
                                    <button class="btn btn-sm btn-outline-danger desinscribirse-btn" data-id="${ev.id}" style="display:${inscrito ? 'inline-block' : 'none'}">Desinscribirse</button>
                                </div>
                            </div>
                        </div>`;
                    });
                    $('.row').html(html);
                });
            });
        }
        cargarEventosEstudiante();

        // Inscribirse a evento
        $(document).on('click', '.inscribirse-btn', function() {
            let id_evento = $(this).data('id');
            $.post('backend/eventos/inscribirse.php', {id_evento: id_evento}, function(resp) {
                alert(resp);
                cargarEventosEstudiante();
            });
        });

        // Desinscribirse de evento
        $(document).on('click', '.desinscribirse-btn', function() {
            let id_evento = $(this).data('id');
            $.post('backend/eventos/desinscribirse.php', {id_evento: id_evento}, function(resp) {
                alert(resp);
                cargarEventosEstudiante();
            });
        });
    }

    // Mostrar nombre en navbar y manejar logout en todas las páginas protegidas
    if (['admin', 'profesor', 'estudiante'].includes(currentPage)) {
        $.get('backend/auth/sesion.php', function(data) {
            let sesion = {};
            try { sesion = JSON.parse(data); } catch {}
            if (sesion.logged && sesion.nombre) {
                $('#navbar-welcome').text('Bienvenido ' + sesion.nombre);
            } else {
                window.location.href = 'index.html';
            }
        });

        $('#logout-btn').click(function() {
            $.get('backend/auth/logout.php', function() {
                window.location.href = 'index.html';
            });
        });
    }

    $(document).on('click', '.ver-inscritos', function() {
        let id_evento = $(this).data('id');
        $.get('backend/eventos/inscritos_evento.php', {id_evento: id_evento}, function(data) {
            let inscritos = [];
            try { inscritos = JSON.parse(data); } catch {}
            let html = '';
            if (inscritos.length === 0) {
                html = '<li class="list-group-item">Ningún estudiante inscrito.</li>';
            } else {
                inscritos.forEach(nombre => {
                    html += `<li class="list-group-item">${nombre}</li>`;
                });
            }
            $('#inscritos-list').html(html);
            $('#inscritosModal').modal('show');
        });
    });

    // --- Lógica de registro (solo en index) ---
    if (currentPage === 'index') {
        $('#registerForm').submit(function(e) {
            e.preventDefault();
            $('#registerError').text('');
            $.ajax({
                url: 'backend/auth/registro.php',
                type: 'POST',
                data: {
                    nombre: $('#registerNombre').val(),
                    email: $('#registerEmail').val(),
                    password: $('#registerPassword').val(),
                    rol: $('#registerRol').val()
                },
                success: function(response) {
                    if (response.includes('Registro exitoso')) {
                        alert('Registro exitoso. Ahora puedes iniciar sesión.');
                        $('#registerModal').modal('hide');
                        $('#loginModal').modal('show');
                    } else {
                        $('#registerError').text(response);
                    }
                },
                error: function() {
                    $('#registerError').text('Error en el servidor.');
                }
            });
        });
    }
});