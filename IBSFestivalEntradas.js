document.addEventListener("DOMContentLoaded", async () => {

   
    


    let codigoValidado = false;
    let maxAsientos = 0;
    const codeFreeSections = ['AnfiteatroA', 'GaleriaA', 'AnfiteatroB', 'GaleriaB'];
    
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //--------------------------------Get all events-------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    async function fetchEventsInfo(artistID, activeEventBoolean) {
        let allEvents, options;
        try {
            const url = `https://zz-eventos-populate-patient-form-test-250829126208.southamerica-west1.run.app?activeEventBoolean=${activeEventBoolean}&artistID=${artistID}`;
    
            const response = await fetch(url, {
                    method: 'GET',


                    headers: {
                    'Content-Type': 'application/json',
                    }
            });
    
            allEvents = await response.json();
            //console.log('allEvents: ', allEvents);

            if (response.ok) {
              
                options = await buildIntroPage(allEvents);

            } else {
                console.log('Ha ocurrido un problema con su solicitud, por favor vuelva a mandar la información...',error);
            }
    
        } catch (error) {
            console.log('Ha ocurrido un problema con su solicitud, por favor vuelva a mandar la información...',error);
        }

        return options;
    }

    const artistID = 3
    const options = await fetchEventsInfo(artistID, 1)
    //console.log('options: ', options);
     
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //--------------------------------Options cards--------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    

    async function buildIntroPage(allEvents) {
        const eventInfo = allEvents.returningData.eventsInfo;
        //console.log('eventInfo: ', eventInfo);

        const options = eventInfo.map(event => ({
            artistName: event.artistName,
            category: event.category,
            city: event.city,
            eventName: event.eventName,
            eventDate: event.eventDate,
            eventID: event.id_eventos,
            status: event.isActive==0 && event.isFinished==0? 'Proximamente': event.isActive==1 && event.isFinished==0? 'active': 'Eveto Pasado',
            recintoName: event.recintoName,
            img: event.isFinished==1?`${event.artistName.split(' ').join('')}Images/${event.eventName}${event.city}PosterSoldOut.png`:`${event.artistName.split(' ').join('')}Images/${event.eventName}${event.city}Poster.png`
        }));

        //console.log('options: ', options);
        await createOptions(options);
        return options;
    }


    async function createOptions(filteredOptions = options) {
        const container = document.getElementById('intro-container');
        container.innerHTML = `
            </br>
            <h1 id="introduction-message">Champagne Show</h1>
            <h1 id="introduction-message2">Venta de Entradas</h1>
            </br>
        `; 

        // Create sections for clinics, centros de estudios and consultorios
        const pastEventsSection = document.createElement('div');
        pastEventsSection.id = 'past-events-section';
        pastEventsSection.classList.add('category-section');

        const presentEventsSection = document.createElement('div');
        presentEventsSection.id = 'present-events-section';
        presentEventsSection.classList.add('category-section');

        const futureEventsSection = document.createElement('div');
        futureEventsSection.id = 'future-events-section';
        futureEventsSection.classList.add('category-section');


        filteredOptions.forEach(option => {
            
            const div = document.createElement('div');
            div.classList.add('selectable');
            div.id = `selectableCard-${option.eventID}`
                
            // Image element
            const imgDiv = document.createElement('div');
            imgDiv.classList.add('imgSelectableContainer');

            const img = document.createElement('img');
            img.src = option.img;
            img.alt = 'Logo';
            imgDiv.appendChild(img);

            // Caption element
            const captionDiv = document.createElement('div');
            captionDiv.classList.add('captionSelectableContainer');

            const nombre = document.createElement('p');
            nombre.classList.add('eventName');
            nombre.innerText = `${option.artistName}: \n${option.eventName}`;
            captionDiv.appendChild(nombre);


            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const date = new Date(option.eventDate);
            const day = date.getUTCDate();
            const month = monthNames[date.getUTCMonth()]; 
            const year = date.getUTCFullYear()
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes().toString().padStart(2, '0'); 
            const formattedDate = `${day} de ${month} de ${year}\n${hours}:${minutes}`

            const city = document.createElement('p');
            city.classList.add('eventInfo');
            city.innerText = `${option.city} \n${formattedDate}`;
            captionDiv.appendChild(city);

            const place = document.createElement('p');
            place.classList.add('eventPlace');
            place.innerText = option.recintoName;
            captionDiv.appendChild(place);

            // Append image and caption to the div
            div.appendChild(imgDiv);
            div.appendChild(captionDiv);

            // Add watermark if status is 'soon'
            if (option.status !== 'active') {
                const watermark = document.createElement('div');
                watermark.classList.add('watermark');
                watermark.textContent = `${option.status}`;
                div.appendChild(watermark);
            }

            // Append to respective section
            if (option.status == 'Eveto Pasado') {
                pastEventsSection.appendChild(div);

            } else if (option.status == 'active') {
                presentEventsSection.appendChild(div);

            }else if (option.status == 'Proximamente') {
                futureEventsSection.appendChild(div);
            }

        });


        const pastEventsTitle = document.createElement('h2');
        pastEventsTitle.id = 'pastEventsTitle';
        pastEventsTitle.textContent = 'Eventos Pasados:';

        const presentEventsTitle = document.createElement('h2');
        presentEventsTitle.id = 'presentEventsTitle';
        presentEventsTitle.textContent = 'Eventos Actuales - Selecciona el día de la función:';

        const futureEventsTitle = document.createElement('h2');
        futureEventsTitle.id = 'futureEventsTitle';
        futureEventsTitle.textContent = 'Eventos Futuros:';

        container.appendChild(presentEventsTitle);
        container.appendChild(presentEventsSection);
        container.appendChild(futureEventsTitle);
        container.appendChild(futureEventsSection);
        container.appendChild(pastEventsTitle);
        container.appendChild(pastEventsSection);
        //container.appendChild(consultorioSection);
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //--------------------------------Options cards--------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    // Add onchange event to inputs to enable/disable submit button
    const header = document.getElementById('header');
    const introContainer = document.getElementById('intro-container');
    const wrappingMessage = document.getElementById('informing-message');
    const mainContainer = document.getElementById('main-container');
    const footer = document.getElementById('footer');
    const footerText = document.getElementById('footerText');

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //--------------------------------Add event listeners--------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    let returningInfo, allSeats, recintoInfo, simpleReservations, occupiedSeats, eventID, selectedEventInfo; 

    options.forEach(opt => {
        if (opt.status == "active"){;
            document.getElementById(`selectableCard-${opt.eventID}`).addEventListener("click", async (event)=>{
                event.preventDefault();

                document.getElementById('intro-container').classList.add('hidden');
                document.getElementById('informing-message').innerHTML = 'Cargando...';
                eventID = opt.eventID;
                selectedEventInfo = opt;
          
                returningInfo = await fetchSelectedEventInfo(eventID);
                //console.log('returningInfo: ',returningInfo);
                //console.log('selectedEventInfo: ',selectedEventInfo);

                introContainer.classList.add('hidden');
                
                await fillFormHtml(returningInfo, selectedEventInfo);

                mainContainer.classList.remove('hidden');
                footer.classList.remove('hidden');
                footerText.classList.remove('hidden');
            })
        }
    });

    async function fetchSelectedEventInfo(eventID) {
        let reservationInfo
        try {
            const url = `https://zz-eventos-populate-patient-form-test-250829126208.southamerica-west1.run.app?selectedEventBoolean=1&eventID=${eventID}`;
    
            const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }
            });
    
            reservationInfo = await response.json();
    
            if (response.ok) {

                document.getElementById('informing-message').innerHTML = '';
                document.getElementById('informing-message').classList.add('hidden');
                
            } else {
                console.log('Ha ocurrido un problema con su solicitud, por favor vuelva a mandar la información...');
            }
    
        } catch (error) {
            console.log('Ha ocurrido un problema con su solicitud, por favor vuelva a mandar la información...');
        }

        return reservationInfo;
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //--------------------------------Populate main-container (Form)---------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    async function fillFormHtml(returningInfo, selectedEventInfo){
        //console.log('returningInfo: ',returningInfo);
        //console.log('selectedEventInfo: ',selectedEventInfo);

        const allSeats = returningInfo.returningData.numSeats;
        const recintoInfo = returningInfo.returningData.recintoInfo;
        const simpleReservations = returningInfo.returningData.simpleReservations;

        const asientosSection = JSON.parse(recintoInfo[0].asientos);
        //console.log('asientosSection: ',asientosSection);
        //console.log('viewBox: ',asientosSection['overlay'].viewBox);

        

        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const date = new Date(selectedEventInfo.eventDate);
        const day = date.getUTCDate();
        const month = monthNames[date.getUTCMonth()]; 
        const year = date.getUTCFullYear()
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0'); 
        const formattedDate = `${day} de ${month} de ${year}</br>Hora: ${hours}:${minutes}`

        document.getElementById('main-container').innerHTML = 
`
    <div class="image-container">
        <span id="day-title" class="form-title">Función de día ${formattedDate}</span>
        <img id="image-restaurante" src="${selectedEventInfo.artistName.split(' ').join('')}Images/${selectedEventInfo.eventName}${selectedEventInfo.city}Poster.png" class="first-image">
    

        <span id="image-title" class="form-title">Completa los pasos para realizar tu reserva</span>
        </br></br>


        <!-- NUEVO: Campo de código de acceso -->
        <div id="codigo-container" class="input-group-container">
            <div class="input-group">
                <label for="codigo-acceso" class="label-form">Código de Acceso (8 dígitos):</label>
                <input type="text" id="codigo-acceso" name="codigo-acceso" placeholder="Ingrese su código" maxlength="8" required>
                <button type="button" id="validar-codigo" class="submit-button">Validar Código</button>
                <p id="codigo-mensaje" style="margin-top: 10px; font-weight: bold;"></p>
                <p id="info-codigos-validos" style="margin-top: 10px; font-weight: bold;"></p>
            </div>
        </div>


        <div id="seatin-info-container" class="input-group-container2">
            <div class="bigbox"><div class="box2"></div> <p>Platea Bs.100</p></div>
            <div class="bigbox"><div class="box4"></div> <p>Palcos Bs.100</p></div>
            <div class="bigbox"><div class="box3"></div> <p>Anfiteatro Bs.100</p></div>
        </div>


        <div id="image-teatro-div" class="image-teatro-div">
            <span id="section-title" class="form-title">Selecciona el sector</span>
            <span id="limite-asientos" class="form-subtitle" style="color: #d32f2f; display: none;">Límite máximo: 2 asientos</span>

            <div id="inner-image-teatro-div" class="inner-image-teatro-div">
                <img id="www" src="../../Theathers/${selectedEventInfo.recintoName.split(' ').join('')}/TeatroCompleto.svg" class="teatro-image">
                <svg id="overlay" viewBox="${asientosSection['overlay'].viewBox}" xmlns="http://www.w3.org/2000/svg"> </svg>
            </div>
        </div>

        
        <div id="image-section-div" class="image-section-div hidden">
            <span id="seats-title" class="form-title">Selección de asientos</span>
            <span id="seats-subtitle" class="form-subtitle"></span>
            <span id="seats-subtitle2" class="form-subtitle"></span>
            <div id="inner-image-section-div" class="inner-image-section-div">
                <img id="image-teatro" src="" class="section-image">
                <svg id="section-overlay"  preserveAspectRatio="xMidYMid meet"></svg>
            </div>
        </div>

        <div id="seating-info-container" class="input-group-container3">
            <div id="div-box-main" class="div-box-main">
                <p>Asientos Seleccionados: </p>
            </div>
            <div id="div-box-seats" class="div-box-seats"></div>
        </div>

        <button id="delete-chosen" class="spam-button">Eliminar Asientos Seleccionados</button>
        </br>
    </div> 


    <div id="form-container" class="form-container">
        <div id="formulario-reserva" class="input-group-container">
            <div class="input-group">
                <label for="nombre" class="label-form">Introduzca nombre completo:</label>
                <input type="text" id="nombre" name="nombre" placeholder="Nombres , Apellidos" required>
            </div>

            <div class="input-group">
                <label for="celular" class="label-form">Número de Celular (WhatsApp <i class="fab fa-whatsapp"></i>)</i>:</label>
                <input type="number" id="celular" name="celular" placeholder="Número de Celular" required>
            </div>

            <button type="submit" id="buttom-reservar" class="submit-button">Reservar Entradas</button>
        </div>
    </div>
`;
    

        const input = document.getElementById('celular');
        const iti = window.intlTelInput(input, {
            preferredCountries: ["bo"], 
            separateDialCode: true,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.0/js/utils.js", 
        });

        const validatedCodes = []; // Ahora almacenará objetos de código completos

        document.getElementById('validar-codigo').addEventListener('click', async function() {
            const codigoInput = document.getElementById('codigo-acceso');
            const codigo = codigoInput.value.trim();
            const mensaje = document.getElementById('codigo-mensaje');
            const infoValida = document.getElementById('info-codigos-validos');

            if (codigo.length !== 8) {
                mensaje.style.color = '#d32f2f';
                mensaje.textContent = 'El código debe tener 8 dígitos.';
                return;
            }

            // Comprobar si el código ya fue validado
            if (validatedCodes.some(c => c.codigo === codigo)) {
                mensaje.style.color = '#d32f2f';
                mensaje.textContent = 'Este código ya ha sido ingresado.';
                return;
            }

            try {
                // Asumo que la URL de la API es la que has configurado
                const response = await fetch(`http://eventoibs.levosolution.com/api/codigos/?codigo=${codigo}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data.length === 0) {
                    mensaje.style.color = '#d32f2f';
                    mensaje.textContent = `Código inválido. Verifique e intente nuevamente.`;
                } else {
                    const codigoData = data[0];

                    const eventDate = new Date(selectedEventInfo.eventDate);
                    const eventHour = eventDate.getUTCHours();
                    const expectedFuncion = eventHour === 15 ? 'primera' : 'segunda';

                    if (codigoData.entradas_disponibles <= 0) {
                        mensaje.style.color = '#d32f2f';
                        mensaje.textContent = 'Este código ya no tiene entradas disponibles.';
                    } else if (!codigoData.habilitado) {
                        mensaje.style.color = '#d32f2f';
                        mensaje.textContent = 'Este código no está habilitado.';
                    } else if (codigoData.funcion !== expectedFuncion) {
                        mensaje.style.color = '#d32f2f';
                        mensaje.textContent = `Este código no es válido para la función seleccionada.`;
                    } else {
                        validatedCodes.push(codigoData); // Almacenar el objeto completo
                        
                        // Recalcular el máximo de asientos sumando las entradas disponibles de todos los códigos validados
                        maxAsientos = validatedCodes.reduce((total, code) => total + code.entradas_disponibles, 0);
                        codigoValidado = true;

                        mensaje.style.color = '#2e7d32';
                        mensaje.textContent = `Código válido. Entradas disponibles para este código: ${codigoData.entradas_disponibles}.`;
                        
                        const codigosIngresadosStr = validatedCodes.map(c => c.codigo).join(', ');
                        infoValida.style.color = '#2e7d32';
                        infoValida.innerHTML = `Límite total de asientos: ${maxAsientos}.<br>Códigos ingresados: ${codigosIngresadosStr}`;
                        infoValida.style.display = 'block';

                        document.getElementById('limite-asientos').textContent = `Límite máximo: ${maxAsientos} asientos`;
                        document.getElementById('limite-asientos').style.display = 'block';

                        codigoInput.value = '';
                        codigoInput.focus();
                    }
                }
            } catch (error) {
                console.error('Error al validar el código:', error);
                mensaje.style.color = '#d32f2f';
                mensaje.textContent = 'Error al conectar con el servidor.';
            }
        });

        // Permitir validar con Enter
        document.getElementById('codigo-acceso').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('validar-codigo').click();
            }
        });

        //--Drawing svg over sections
        const sectionsSVG = document.getElementById('overlay');
        Object.keys(asientosSection).forEach(key => {
            if(key !== 'overlay'){ ;
                const section = asientosSection[key];
                //console.log('key: ', key);
                //console.log('value:', section);
                if(section.Shape=='path'){
                    sectionsSVG.insertAdjacentHTML('beforeend', `
                            <path id="${key}" d="${section.d}" fill="${section.fill}" />
                        `);
                
                }else if(section.Shape=='rect'){
                    sectionsSVG.insertAdjacentHTML('beforeend', `
                            <rect id="${key}" x="${section.x}" y="${section.y}" width="${section.width}" height="${section.height}" fill="${section.fill}" />
                        `);
                
                }else if(section.Shape=='polygon'){
                    sectionsSVG.insertAdjacentHTML('beforeend', `
                            <polygon id="${key}" points="${section.points}"  fill="${section.fill}" />
                        `);
                }

            }
        })


        //--adding event listener and hover effect over section SVGs
        const seatSectionDiv = document.getElementById('image-section-div');
        const innerImageTeatroSection = document.getElementById('inner-image-section-div');
        const imageTeatroSection = document.getElementById('image-teatro');
        const seatsSectionSubtitle = document.getElementById('seats-subtitle');
        document.querySelectorAll("#overlay *").forEach(section => {
            //console.log('section:', section);
            section.addEventListener("click", () => {

                seatsSectionSubtitle.innerHTML=`Cargando...`
                innerImageTeatroSection.classList.add('hidden');

                const newSrc = `../../Theathers/${selectedEventInfo.recintoName.split(' ').join('')}/${section.id}.svg`;

                imageTeatroSection.onload = async () => {
                    seatsSectionSubtitle.innerHTML = `Sección: ${section.id.slice(0, -1)} ${section.id.slice(-1)}`;
                    innerImageTeatroSection.classList.remove('hidden');
                    await drawSeats(section.id, imageTeatroSection, innerImageTeatroSection, seatsSectionSubtitle, returningInfo, selectedEventInfo);
                };
                imageTeatroSection.src = newSrc;

                seatSectionDiv.classList.remove('hidden');
                seatSectionDiv.scrollIntoView({ behavior: "smooth", block: "start" });
            });

            section.addEventListener("mouseenter", () => {
                section.style.fill = "#3d3d3d"; 
            });

            section.addEventListener("mouseleave", () => {
                section.style.fill = "";
            });
        });


        //--Delete all chosen seats
        document.getElementById('delete-chosen').addEventListener("click", (event) => {
            event.preventDefault();
            selectedSeats.forEach(seatId => {
                const seat = document.getElementById(seatId)
                const seatParts = seatId.split('-');
                //console.log(seatId)
                selectedSeats.delete(seatId);
                document.getElementById('image-section-div').classList.add('hidden');
                document.getElementById('image-teatro-div').scrollIntoView({ behavior: "smooth", block: "start" });
            });
            //selectedSeats = new Set();  
            updateSelectedSeatList(selectedSeats, returningInfo); 
        });


        //--Send Info
        const requiredFields=['nombre', 'celular'];

        const submitButton = document.getElementById('buttom-reservar');
        submitButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission for now
            // Validate form before submission
            const isValid = checkFormValidity();
            if (!isValid) {
                console.log('nope');
                return; // Stop if validation fails
            }
            fetchConsultaInfo(requiredFields, returningInfo, selectedEventInfo, validatedCodes);
        });


        requiredFields.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.addEventListener('keyup', checkFormValidity);
                field.addEventListener('change', checkFormValidity);
            }
        });
        checkFormValidity();
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //--------------------------------Draw Seats-----------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const selectedSeats = new Set();                    
    //selectedSeats.has(selectedService)

    function calculatePaidSeatsCount(currentSelectedSeats, layoutData, codeFreeSections) {
        let count = 0;
        for (const seatId of currentSelectedSeats) {
            const sectionName = seatId.split('-')[0];
            if (!codeFreeSections.includes(sectionName)) { // Only count seats in paid sections
                const sectionInfo = layoutData[sectionName];
                if (sectionInfo) {
                    if (sectionInfo.isDouble === 1) {
                        count += 2; // A double seat (Palco) counts as 2
                    } else if (sectionInfo.isSpecial === 1) {
                        const numTickets = parseInt(seatId.split('-')[1]);
                        count += numTickets;
                    } else {
                        count += 1; // A single seat counts as 1
                    }
                }
            }
        }
        return count;
    }
    
    
    async function drawSeats(sectionId, imageTeatroSection, innerImageTeatroSection, seatsSectionSubtitle, returningInfo, selectedEventInfo){
        //console.log('sectionId: ',sectionId);
        //console.log('returningInfo: ',returningInfo);
        //console.log('selectedEventInfo: ',selectedEventInfo);

        const allSeats = returningInfo.returningData.numSeats;
        const recintoInfo = returningInfo.returningData.recintoInfo;
        const simpleReservations = returningInfo.returningData.simpleReservations;

        const occupiedSeats = simpleReservations.flatMap(reservation => 
            allSeats.filter(seat => seat.id_asiento === reservation.asiento_id)
        );
        //console.log('occupiedSeats: ', occupiedSeats);

        const layoutData = JSON.parse(recintoInfo[0].seating);
        //console.log('layoutData: ',layoutData);

        //const imageTeatroSection = document.getElementById('image-teatro');
        //console.log("You clicked " + sectionId);
        const sectionInfo = layoutData[sectionId];
        //console.log("sectionInfo " , sectionInfo);
        const isCurved = sectionInfo.isCurved;  
        if(sectionInfo.isSpecial == 1){
            drawSpecialButtons(sectionId, imageTeatroSection, innerImageTeatroSection, seatsSectionSubtitle, returningInfo, selectedEventInfo)
        }else{
            if(isCurved===0){
                drawRectanleSection(sectionId, imageTeatroSection, innerImageTeatroSection, returningInfo, selectedEventInfo);
            }else{
                drawCurvedSection(sectionId, imageTeatroSection, innerImageTeatroSection, returningInfo, selectedEventInfo);
            }
        }
    }

    async function drawSpecialButtons(sectionId, imageTeatroSection, innerImageTeatroSection, seatsSectionSubtitle, returningInfo, selectedEventInfo) {
        //console.log('returningInfo: ',returningInfo);
        //console.log('selectedEventInfo: ',selectedEventInfo);

        const allSeats = returningInfo.returningData.numSeats;
        const recintoInfo = returningInfo.returningData.recintoInfo;
        const simpleReservations = returningInfo.returningData.simpleReservations;

        const occupiedSeats = simpleReservations.flatMap(reservation => 
            allSeats.filter(seat => seat.id_asiento === reservation.asiento_id)
        );
        //console.log('occupiedSeats: ', occupiedSeats);

        const layoutData = JSON.parse(recintoInfo[0].seating);
        //console.log('layoutData: ',layoutData);


        const specialSections = Object.entries(layoutData)
            .filter(([key, value]) => value.isSpecial === 1)
            .reduce((acc, [key, value]) => {
                acc[key] = { numSeats: value.numSeats };
                return acc;
            }, {});
        //console.log('specialSections: ', specialSections);


        const occupiedSpecialSections = Object.keys(specialSections).reduce((acc, sectionName) => {
            acc[sectionName] = occupiedSeats.filter(seat => seat.code === sectionName).length;
            return acc;
        }, {});
       //console.log('occupiedSpecialSections: ',occupiedSpecialSections);


        const numSeats = specialSections[sectionId].numSeats - occupiedSpecialSections[sectionId];
        //console.log("numSeats: ", numSeats);


        //--Scale image
        const imgNaturalWidth = imageTeatroSection.naturalWidth;
        const imgNaturalHeight = imageTeatroSection.naturalHeight;
        //console.log("imgNaturalWidth: ", imgNaturalWidth, "\nimgNaturalHeight: ", imgNaturalHeight);
        let finalWidth, finalHeight;
        if(imgNaturalWidth>imgNaturalHeight){
            finalWidth = 300;
            finalHeight = (imgNaturalHeight*300)/imgNaturalWidth;
        }else{
            finalHeight = 300;
            finalWidth = (imgNaturalWidth*300)/imgNaturalHeight;
        }
        innerImageTeatroSection.style.width = finalWidth + 'px';
        innerImageTeatroSection.style.height = finalHeight + 'px';
        const imgWidth = imageTeatroSection.width;
        const imgHeight = imageTeatroSection.height;
        //console.log("imgWidth: ", imgWidth, "\nimgHeight: ", imgHeight);
        //document.getElementById('seats-subtitle2').innerHTML=`imgWidth: ${imgWidth}, imgHeight:${imgHeight}`; 


        //--Change info
        seatsSectionSubtitle.innerHTML = `Sección: ${sectionId.slice(0, -1)} ${sectionId.slice(-1)}`;  
        document.getElementById('seats-subtitle2').innerHTML=`Esta sección ofrece graderias NO numeradas </br> Asientos disponibles: ${numSeats}`;


        //--Remove Buttons Section
        const sectionSvg = document.getElementById("section-overlay");
        sectionSvg.setAttribute("viewBox", `0 0 ${imgWidth} ${imgHeight}`);
        sectionSvg.innerHTML = ``;
        const addedElement = document.getElementById('addingButtons');
        if (addedElement) {
            addedElement.remove();
        }


        //--Get Current Selected Tickets
        let currentTicekts, currentTicektsNum, numTickets;
        for (const item of selectedSeats) {
            if (item.startsWith(sectionId)) {
                currentTicekts=item;
            }
        }
        //console.log(`currentTicekts: `,currentTicekts)
        if(currentTicekts){
            const nameParts = currentTicekts.split('-');
            currentTicektsNum = nameParts[1];
            //console.log(`currentTicektsNum: `,currentTicektsNum)
            numTickets = currentTicektsNum;
        }else{
            numTickets = 0;
        }


        //--Add Buttons Section
        innerImageTeatroSection.insertAdjacentHTML('beforeend', `
            <div id='addingButtons' class='addingButtons'>
                <button id='minusButtons' class='minusButtons'>-</button> 
                <div id='displayButton' class='displayButton'>${numTickets}</div>  
                <button id='plusButtons' class='plusButtons'>+</button>    
            </div>
        `);

        
        //--Buttons Event Listeners
        document.getElementById('plusButtons').addEventListener("click", (event)=>{
            event.preventDefault();
            
            // Verificar código válido solo si la sección no es libre
            if (!codeFreeSections.includes(sectionId)) {
                if (!codigoValidado) {
                    alert('Este sector requiere un código de acceso validado. Puede seleccionar asientos en Anfiteatro y Galería sin código.');
                    return;
                }
            }

            const isPaidSection = !codeFreeSections.includes(sectionId);
            if (isPaidSection) {
                const paidSeatsCount = calculatePaidSeatsCount(selectedSeats, layoutData, codeFreeSections);
                if (paidSeatsCount + 1 > maxAsientos) {
                    alert(`Ha alcanzado su límite de ${maxAsientos} asientos para sectores con código.`);
                    return;
                }
            }

            if (numTickets + 1 > numSeats) {
                alert('No hay más asientos disponibles en esta sección.');
                return;
            }

            numTickets++;
            
            document.getElementById('displayButton').innerHTML = numTickets;
            
            for (const item of selectedSeats) {
                if (item.startsWith(sectionId)) {
                    selectedSeats.delete(item);
                }
            }
            
            const seatId = `${sectionId}-${numTickets}-${numTickets}`
            selectedSeats.add(seatId);
            updateSelectedSeatList(selectedSeats, returningInfo);
        });

        document.getElementById('minusButtons').addEventListener("click", (event)=>{
            event.preventDefault();
            numTickets--;
            numTickets<0?numTickets=0:numTickets;
            //console.log('numTickets: ',numTickets);
            document.getElementById('displayButton').innerHTML=numTickets;
            for (const item of selectedSeats) {
                if (item.startsWith(sectionId)) {
                    selectedSeats.delete(item);
                }
            }
            if(numTickets>0){
                const seatId = `${sectionId}-${numTickets}-${numTickets}`
                selectedSeats.add(seatId);
            }
            updateSelectedSeatList(selectedSeats, returningInfo);
            //console.log(`Selected Seats: `,selectedSeats)
        })
    }
    

    async function drawCurvedSection(sectionId, imageTeatroSection, innerImageTeatroSection, returningInfo, selectedEventInfo) {
        //console.log('returningInfo: ',returningInfo);
        //console.log('selectedEventInfo: ',selectedEventInfo);

        const allSeats = returningInfo.returningData.numSeats;
        const recintoInfo = returningInfo.returningData.recintoInfo;
        const simpleReservations = returningInfo.returningData.simpleReservations;

        const occupiedSeats = simpleReservations.flatMap(reservation => 
            allSeats.filter(seat => seat.id_asiento === reservation.asiento_id)
        );
        //console.log('occupiedSeats: ', occupiedSeats);

        const layoutData = JSON.parse(recintoInfo[0].seating);
        //console.log('layoutData: ',layoutData);

        const sectionInfo = layoutData[sectionId];
        const numRows = sectionInfo.rows;
        const seatsPerRow = sectionInfo.seatsPerRow;
        const numSeats = sectionInfo.numSeats;
        const seatRowNum = sectionInfo.seatRowNum;
        const xCoordinates = sectionInfo.xCoordinates; 
        const yCoordinates = sectionInfo.yCoordinates; 
        const seatWidth = sectionInfo.seatWidth; 
        const seatHeight = sectionInfo.seatHeight; 
        const angle = sectionInfo.angle;        
        //console.log("numRows: ", numRows, "\nseatsPerRow: ", seatsPerRow, "\nnumSeats: ", numSeats);
        const addedElement = document.getElementById('addingButtons');
        if (addedElement) {
            addedElement.remove();
        }


        //--Scale image
        const imgNaturalWidth = imageTeatroSection.naturalWidth;
        const imgNaturalHeight = imageTeatroSection.naturalHeight;
        //console.log("imgNaturalWidth: ", imgNaturalWidth, "\nimgNaturalHeight: ", imgNaturalHeight);
        let finalWidth, finalHeight;
        if(imgNaturalWidth>imgNaturalHeight){
            finalWidth = 300;
            finalHeight = (imgNaturalHeight*300)/imgNaturalWidth;
        }else{
            finalHeight = 300;
            finalWidth = (imgNaturalWidth*300)/imgNaturalHeight;
        }
        innerImageTeatroSection.style.width = finalWidth + 'px';
        innerImageTeatroSection.style.height = finalHeight + 'px';
        const imgWidth = imageTeatroSection.width;
        const imgHeight = imageTeatroSection.height;
        //console.log("imgWidth: ", imgWidth, "\nimgHeight: ", imgHeight);

        //document.getElementById('seats-subtitle2').innerHTML=`imgWidth: ${imgWidth}, imgHeight:${imgHeight}`;   
        document.getElementById('seats-subtitle2').innerHTML=`Los asientos en esta sección se venden en pares`;


        //--Create SVG section
        const sectionSvg = document.getElementById("section-overlay");
        sectionSvg.setAttribute("viewBox", `0 0 ${imgWidth} ${imgHeight}`);
        sectionSvg.innerHTML = `
            <symbol id="seat" viewBox="0 0 300 215" preserveAspectRatio="xMidYMid meet">
                <path d="m 353.73291,144.5978 h -4.54518 v -0.0663 h -2.67827 c 12.39101,-2.07169 21.63707,-9.54019 21.63707,-18.37996 v -14.22185 c 0,-23.70306 -18.03645,-99.685476 -18.03645,-99.685476 C 348.24308,1.8856343 333.84065,-6.5855346 318.1268,-6.5855346 H 218.08742 c -15.72494,0 -30.1163,8.4711689 -31.98326,18.8297086 0,0 -18.03643,75.982416 -18.03643,99.685476 v 14.22182 c 0,8.83976 9.24604,16.30826 21.63705,18.37995 H 92.543656 c 12.390974,-2.07169 21.637064,-9.54019 21.637064,-18.37995 v -14.22182 c 0,-23.70306 -18.036445,-99.685476 -18.036445,-99.685476 C 94.277289,1.8856343 79.874787,-6.5855346 64.160993,-6.5855346 H -35.878411 c -15.724919,0 -30.116278,8.4711689 -31.983266,18.8297086 0,0 -18.036424,75.982416 -18.036424,99.685476 v 14.22182 c 0,8.92087 9.412726,16.44833 21.981549,18.43894 h -7.556856 c -27.649188,0 -50.053032,14.8706 -50.053032,33.20638 v 22.75934 c 0,7.93297 9.69055,14.36189 21.648159,14.36189 H 382.1378 c 11.95761,0 21.64818,-6.42892 21.64818,-14.36189 v -22.75934 c 0,-18.34312 -22.41496,-33.20638 -50.05307,-33.20638 z"/> 
            </symbol>
        `;

        for (let i = 0; i < xCoordinates.length; i++) {
            const seatX = xCoordinates[i];
            const seatY = yCoordinates[i];
            const angeXY =angle[i];

            const seatId =`${sectionId}-${seatRowNum[i]}`;//PlateaB-F1-11  'P31-1y2'

            
            const seatParts = seatRowNum[i].split('y');
            //console.log('seatParts: ',seatParts);
            const seat1 = seatParts[0];
            //console.log('seat1: ',seat1);
            const seat2 = seatParts[1];
            //console.log('seat2: ',seat2);
            const seat2Parts = seat1.split('-');
            //console.log('seat2Parts: ',seat2Parts);
            const seat2Num = seat2Parts[1];
            const palcoNum = seat2Parts[0];
            const seat1ID = `${sectionId}-${seat1}`
            const seat2ID = `${sectionId}-${palcoNum}-${seat2}`
            //console.log('seat1ID: ',seat1ID);
            //console.log('seat2ID: ',seat2ID);
            const isSeatOccupied = occupiedSeats.some(seat => {return  seat.code == seat1ID||seat.code == seat2ID});
            //console.log('isSeatOccupied: ',isSeatOccupied);

            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#seat");
            use.setAttribute("x", seatX);
            use.setAttribute("y", seatY);
            use.setAttribute("width", seatWidth);
            use.setAttribute("height", seatHeight);
            //use.setAttribute("class", `seat ${seat.status}`);
            use.setAttribute("id", `${seatId}`);
            use.setAttribute("class", `seat ${isSeatOccupied?'sold':'available'}`);
            use.setAttribute("pointer-events", "bounding-box");
            use.setAttribute("transform", `rotate(${angeXY}, ${seatX}, ${seatY})`);
            use.setAttribute("fill","white");
            use.setAttribute("stroke", "#000000ff");
            sectionSvg.appendChild(use);

            // Create text element instead of debugRect
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", seatX + seatWidth / 2); 
            text.setAttribute("y", seatY + seatHeight / 2); 
            text.setAttribute("text-anchor", "middle");              
            text.setAttribute("dominant-baseline", "middle");         
            text.setAttribute("font-size", seatWidth / 5); 
            text.setAttribute("font-weigth", "bold"); 
            text.setAttribute("fill", "#000000ff");
            text.setAttribute("stroke", "#ffffff");   
            text.setAttribute("stroke-width", "1");   
            text.setAttribute("paint-order", "stroke");
            text.setAttribute("transform", `rotate(${angeXY}, ${seatX}, ${seatY})`)
            text.textContent = `${seatRowNum[i]}`;
            sectionSvg.appendChild(text);

            // Create rect for the seat
            const debugRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            debugRect.setAttribute("x", seatX);
            debugRect.setAttribute("y", seatY);
            debugRect.setAttribute("width", seatWidth);
            debugRect.setAttribute("height", seatHeight);
            debugRect.setAttribute("id", `rect-${seatId}`);
            debugRect.setAttribute("fill", "none");
            debugRect.setAttribute("stroke", "none");
            debugRect.setAttribute("pointer-events", "bounding-box");
            debugRect.setAttribute("transform", `rotate(${angeXY}, ${seatX}, ${seatY})`);
            sectionSvg.appendChild(debugRect);

            //--pointer
            const seatElement = document.getElementById(seatId);
            if (seatElement.classList.contains('sold')) {
                document.getElementById(`rect-${seatId}`).classList.remove('rectAvailable');
                document.getElementById(`rect-${seatId}`).classList.add('rectNonAvailable');
            } else{
                document.getElementById(`rect-${seatId}`).classList.remove('rectNonAvailable');
                document.getElementById(`rect-${seatId}`).classList.add('rectAvailable');
            }

            //--update seats colors based on selected List
            if(selectedSeats.has(seatId)){
                const seatElement = document.getElementById(seatId);
                seatElement.classList.remove('available');
                seatElement.classList.add('selected');
            }

            //--update List of selected seats
            debugRect.addEventListener("click", (event) => {
                event.preventDefault();
                
                const sectionName = seatId.split('-')[0];
                // Verificar código válido solo si la sección no es libre
                if (!codeFreeSections.includes(sectionName)) {
                    if (!codigoValidado) {
                        alert('Este sector requiere un código de acceso validado. Puede seleccionar asientos en Anfiteatro y Galería sin código.');
                        return;
                    }
                }
                
                const seatElement = document.getElementById(seatId);
                
                if (seatElement.classList.contains('available')) {
                    const isPaidSection = !codeFreeSections.includes(sectionName);

                    if (isPaidSection) {
                        const paidSeatsCount = calculatePaidSeatsCount(selectedSeats, layoutData, codeFreeSections);
                        
                        if (paidSeatsCount + 2 > maxAsientos) {
                            alert(`Ha alcanzado su límite de asientos con código. Un palco equivale a 2 asientos y solo le queda(n) ${maxAsientos - paidSeatsCount} asiento(s) disponible(s).`);
                            return;
                        }
                    }
                    
                    seatElement.classList.remove('available');
                    seatElement.classList.add('selected');
                    selectedSeats.add(seatId);
                    updateSelectedSeatList(selectedSeats, returningInfo);
                } else if (seatElement.classList.contains('selected')) {
                    seatElement.classList.remove('selected');
                    seatElement.classList.add('available');
                    selectedSeats.delete(seatId);
                    updateSelectedSeatList(selectedSeats, returningInfo);
                }
            });

        }
    }

    async function drawRectanleSection(sectionId, imageTeatroSection, innerImageTeatroSection, returningInfo, selectedEventInfo) {
        //console.log('returningInfo: ',returningInfo);
        //console.log('selectedEventInfo: ',selectedEventInfo);

        const allSeats = returningInfo.returningData.numSeats;
        const recintoInfo = returningInfo.returningData.recintoInfo;
        const simpleReservations = returningInfo.returningData.simpleReservations;

        const occupiedSeats = simpleReservations.flatMap(reservation => 
            allSeats.filter(seat => seat.id_asiento === reservation.asiento_id)
        );
        //console.log('occupiedSeats: ', occupiedSeats);

        const layoutData = JSON.parse(recintoInfo[0].seating);
        
        //console.log('layoutData: ',layoutData);
        //console.log("sectionId: ", sectionId, "\nimageTeatroSection: ", imageTeatroSection, "\ninnerImageTeatroSection: ", innerImageTeatroSection, "\nlayoutData: ", layoutData);
        const sectionInfo = layoutData[sectionId];
        const numRows = sectionInfo.rows;
        const seatsPerRow = sectionInfo.seatsPerRow;
        const numSeats = sectionInfo.numSeats;
        const seatNum = sectionInfo.seaNumbers;
        const seatRow = sectionInfo.rowNames;
        //console.log("numRows: ", numRows, "\nseatsPerRow: ", seatsPerRow, "\nnumSeats: ", numSeats);
        const addedElement = document.getElementById('addingButtons');
        if (addedElement) {
            addedElement.remove();
        }

        //--Scale image
        const imgNaturalWidth = imageTeatroSection.naturalWidth;
        const imgNaturalHeight = imageTeatroSection.naturalHeight;
        //console.log("imgNaturalWidth: ", imgNaturalWidth, "\nimgNaturalHeight: ", imgNaturalHeight);
        let finalWidth, finalHeight;
        if(imgNaturalWidth>imgNaturalHeight){
            finalWidth = 375;
            finalHeight = (imgNaturalHeight*375)/imgNaturalWidth;
        }else{
            finalHeight = 400;
            finalWidth = (imgNaturalWidth*400)/imgNaturalHeight;
        }
        innerImageTeatroSection.style.width = finalWidth + 'px';
        innerImageTeatroSection.style.height = finalHeight + 'px';
        const imgWidth = imageTeatroSection.width;
        const imgHeight = imageTeatroSection.height;   
        //document.getElementById('seats-subtitle2').innerHTML=`imgWidth: ${imgWidth}, imgHeight:${imgHeight}`;      
        document.getElementById('seats-subtitle2').innerHTML=``; 
        //console.log("imgWidth: ", imgWidth, "\nimgHeight: ", imgHeight);

        const hSpaceForSeats = imgWidth*0.85;
        const hSpaceForOneSeat = hSpaceForSeats/seatsPerRow;
        const vSpaceForSeats = imgHeight*0.85;
        const vSpaceForOneSeat = vSpaceForSeats/numRows;
        //console.log("hSpaceForOneSeat: ",hSpaceForOneSeat, "\nvSpaceForOneSeat: ",vSpaceForOneSeat);

        const spaceForHSpaces = imgWidth*0.15;
        const spaceForOneHSpace = spaceForHSpaces/(seatsPerRow+1);
        const spaceForVSpaces = imgHeight*0.15;
        const spaceForOneVSpace = spaceForVSpaces/(numRows+1);
        //console.log("spaceForOneHSpace: ",spaceForOneHSpace, "\nspaceForOneVSpace: ",spaceForOneVSpace);
    
        const sectionSvg = document.getElementById("section-overlay");
        sectionSvg.setAttribute("viewBox", `0 0 ${imgWidth} ${imgHeight}`);
        sectionSvg.innerHTML=`<symbol id="seat" viewBox="0 0 300 215" preserveAspectRatio="xMidYMid meet">
                            <path d="m 220.52633,158.1032 h -6.02498 c 10.02096,-2.15907 17.52559,-10.32346 17.52559,-19.99921 v -15.4252 c 0,-25.708701 -14.38021,-108.120417 -14.38021,-108.120417 C 216.15821,3.3233172 204.67531,-5.8646406 192.14689,-5.8646406 h -79.76006 c -12.537274,0 -24.011315,9.1879578 -25.499833,20.4230136 0,0 -14.371354,82.411716 -14.371354,108.120417 v 15.4252 c 0,9.67575 7.504643,17.84014 17.525594,19.99921 h -6.024974 c -22.044331,0 -39.906621,16.12889 -39.906621,36.01614 v 24.68515 c 0,8.60422 7.726148,15.57713 17.259792,15.57713 H 243.19975 c 9.53363,0 17.25979,-6.97291 17.25979,-15.57713 v -24.68515 c 0,-19.89523 -17.87117,-36.01614 -39.90662,-36.01614 z" /> 
                        </symbol>`
        
        let xPosition = 0;
        let yPosition = spaceForOneVSpace;
        for (let i = 0; i < numRows; i++) {
            xPosition = spaceForOneHSpace;
            for (let ii = 0; ii < seatsPerRow; ii++) {

                const seatId =`${sectionId}-${seatRow[i]}${seatNum[ii]}`; //PlateaB-F1-11
                const isSeatReal = allSeats.some(seat => seat.code === seatId);
                //console.log('isSeatReal: ',isSeatReal);
                if(!isSeatReal) {
                    xPosition += hSpaceForOneSeat + spaceForOneHSpace;
                    continue;
                }

                const isSeatOccupied = occupiedSeats.some(seat => seat.code === seatId);
                //console.log('isSeatOccupied: ',isSeatOccupied);

                const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
                use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#seat");
                use.setAttribute("x", xPosition);
                use.setAttribute("y", yPosition);
                use.setAttribute("width", hSpaceForOneSeat);
                use.setAttribute("height", vSpaceForOneSeat);
                //use.setAttribute("class", `seat ${seat.status}`);
                use.setAttribute("id", `${seatId}`);
                use.setAttribute("class", `seat ${isSeatOccupied?'sold':'available'}`);
                use.setAttribute("pointer-events", "bounding-box");
                use.setAttribute("fill","white");
                use.setAttribute("stroke", "#000000ff");
                sectionSvg.appendChild(use);

                // Create text element instead of debugRect
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", xPosition + hSpaceForOneSeat / 2); 
                text.setAttribute("y", yPosition + vSpaceForOneSeat / 2); 
                text.setAttribute("text-anchor", "middle");              
                text.setAttribute("dominant-baseline", "middle");         
                text.setAttribute("font-size", Math.min(14, hSpaceForOneSeat / 3.5)); 
                text.setAttribute("font-weigth", "bold"); 
                text.setAttribute("fill", "#000000ff");
                //text.setAttribute("stroke", "#000000ff");   
                text.setAttribute("stroke-width", "1");   
                text.setAttribute("paint-order", "stroke");
                text.textContent = `${seatRow[i]}${seatNum[ii]}`;
                sectionSvg.appendChild(text);

                const debugRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                debugRect.setAttribute("x", xPosition);
                debugRect.setAttribute("y", yPosition);
                debugRect.setAttribute("width", hSpaceForOneSeat);
                debugRect.setAttribute("height", vSpaceForOneSeat);
                debugRect.setAttribute("id", `rect-${seatId}`);
                debugRect.setAttribute("fill", "none");
                debugRect.setAttribute("stroke", "none");
                debugRect.setAttribute("pointer-events", "bounding-box");
                sectionSvg.appendChild(debugRect);

                //--pointer
                const seatElement = document.getElementById(seatId);
                if (seatElement.classList.contains('sold')) {
                    document.getElementById(`rect-${seatId}`).classList.remove('rectAvailable');
                    document.getElementById(`rect-${seatId}`).classList.add('rectNonAvailable');
                } else{
                    document.getElementById(`rect-${seatId}`).classList.remove('rectNonAvailable');
                    document.getElementById(`rect-${seatId}`).classList.add('rectAvailable');
                }

                //--update seats colors based on selected List
                if(selectedSeats.has(seatId)){
                    const seatElement = document.getElementById(seatId);
                    seatElement.classList.remove('available');
                    seatElement.classList.add('selected');
                }

                //--update List of selected seats
                debugRect.addEventListener("click", (event) => {
                    event.preventDefault();
                    
                    const sectionName = seatId.split('-')[0];
                    // Verificar código válido solo si la sección no es libre
                    if (!codeFreeSections.includes(sectionName)) {
                        if (!codigoValidado) {
                            alert('Este sector requiere un código de acceso validado. Puede seleccionar asientos en Anfiteatro y Galería sin código.');
                            return;
                        }
                    }
                    
                    const seatElement = document.getElementById(seatId);
                    
                if (seatElement.classList.contains('available')) {
                    const isPaidSection = !codeFreeSections.includes(sectionName);

                    if (isPaidSection) {
                        const paidSeatsCount = calculatePaidSeatsCount(selectedSeats, layoutData, codeFreeSections);
                        
                        if (paidSeatsCount + 1 > maxAsientos) {
                            alert(`Ha alcanzado su límite de ${maxAsientos} asientos para sectores con código. Para seleccionar más, deseleccione alguno de los ya elegidos.`);
                            return;
                        }
                    }
                    
                    // Si se pasa la validación (o no es necesaria), se selecciona el asiento.
                    seatElement.classList.remove('available');
                    seatElement.classList.add('selected');
                    selectedSeats.add(seatId);
                    updateSelectedSeatList(selectedSeats, returningInfo);
                } else if (seatElement.classList.contains('selected')) {
                        seatElement.classList.remove('selected');
                        seatElement.classList.add('available');
                        selectedSeats.delete(seatId);
                        updateSelectedSeatList(selectedSeats, returningInfo);
                    }
                });

                xPosition += hSpaceForOneSeat + spaceForOneHSpace;
            }
            yPosition += vSpaceForOneSeat + spaceForOneVSpace;
        }  
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //--------------------------------Update seats count---------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    function updateSelectedSeatList(selectedSeats, returningInfo){
        //console.log(`Selected Seats: `,selectedSeats);
        //console.log('returningInfo: ',returningInfo);

        const recintoInfo = returningInfo.returningData.recintoInfo;

        const layoutData = JSON.parse(recintoInfo[0].seating);
        //console.log('layoutData: ',layoutData);


        const seatInfoBoxMain = document.getElementById('div-box-main');
        const seatInfoBoxSeats = document.getElementById('div-box-seats');

        const doubleSections = [];
        const singleSections = [];
        const specialSections = [];
        Object.entries(layoutData).forEach(([key, value]) => {
            if (value.isDouble === 1 && value.isSpecial === 0) {
                doubleSections.push(key);
            } else if (value.isDouble === 0 && value.isSpecial === 0) {
                singleSections.push(key);
            } else {
                specialSections.push(key);
            }
        });
        //console.log('doubleSections:', doubleSections);
        //console.log('singleSections:', singleSections);
        //console.log('specialSections:', specialSections);

        let singleSeats= [], doubleSeats = [], specialSeats = [];
        let priceSingle = 0, priceDouble = 0, priceSpecial = 0, finalPrice = 0;

        selectedSeats.forEach(seat => {
            const nameParts = seat.split('-');
            //console.log(`seat: `,seat, `\nsingleSeats: `,nameParts);
            const zone = nameParts[0];
            const laneNum = nameParts[1];
            const seatNum = nameParts[2];
            const seatName = [laneNum, seatNum].join('-');
            //console.log(`laneNum: `,laneNum);

            if(singleSections.some(prefix => zone.startsWith(prefix))) singleSeats.push(seatName);
            if(doubleSections.some(prefix => zone.startsWith(prefix))) doubleSeats.push(seatName);
            if(specialSections.some(prefix => zone.startsWith(prefix))) specialSeats.push(seatName);

            const ticketPrice = layoutData[zone].price;
            const isDouble = layoutData[zone].isDouble;
            const isSpecial = layoutData[zone].isSpecial;
            if(isDouble == 0 && isSpecial == 0) priceSingle+=ticketPrice;
            if(isDouble == 1 && isSpecial == 0) priceDouble+=ticketPrice*2;
            if(isDouble == 0 && isSpecial == 1) priceSpecial+=ticketPrice*parseInt(seatNum);
            
        });
        //console.log(`priceSingle: `,priceSingle, `\npriceDouble: `,priceDouble, `\npriceSpecial: `, priceSpecial)
        //console.log(`singleSeats: `,singleSeats, `\ndoubleSeats: `,doubleSeats, `\nspecialSeats: `, specialSeats);
        finalPrice = priceSingle + priceDouble + priceSpecial;
        //console.log(`finalPrice: `,finalPrice);
        
        let numSpecialSeat = 0;
        specialSeats.forEach(seatInfo => {
            numSpecialSeat+=parseInt(seatInfo[0]);
        })
        seatInfoBoxMain.innerHTML =`
                                    <p>Asientos Seleccionados: </p>
                                    <p>Total Asientos: ${parseInt(singleSeats.length)+parseInt(doubleSeats.length)*2+numSpecialSeat}</p>
                                    <p id='finalPrice'>Precio: ${finalPrice}Bs.</p>
                                    `
         seatInfoBoxSeats.innerHTML=`${singleSeats.length>0?
                                        `<div class="div-box-seats-row">
                                            <div class="div-box-seats-row-image">
                                                <p>x${singleSeats.length}</p>
                                                <img id="image-teatro" src="../../Theathers/Asientos/butacaSimple.svg" class="seat-image"> 
                                            </div>
                                            <div class="div-box-seats-row-seatsList">
                                                <p> ${singleSeats.join(', ')}</p>
                                            </div>
                                        </div>`:''
                                    }
                                    ${doubleSeats.length>0?
                                        `<div class="div-box-seats-row">
                                            <div class="div-box-seats-row-image">
                                                <p>x${doubleSeats.length}</p>
                                                <img id="image-teatro" src="../../Theathers/Asientos/butacaDoble.svg" class="seat-image"> 
                                            </div>
                                            <div class="div-box-seats-row-seatsList">
                                                <p> ${doubleSeats.join(', ')}</p>
                                            </div>
                                        </div>`:''
                                    }
                                    ${specialSeats.length>0?
                                        `<div class="div-box-seats-row">
                                            <div class="div-box-seats-row-image">
                                                <p>x${parseInt(numSpecialSeat)}</p>
                                                <img id="image-teatro" src="../../Theathers/Asientos/asientoAnfiteatro.svg" class="seat-image"> 
                                            </div>
                                            <div class="div-box-seats-row-seatsList">
                                                <p></p>
                                            </div>
                                        </div>`:''
                                    }
                                    `
    }

    

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //--------------------------------Disable/Enable submit button based on form validity------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    const requiredFields=['nombre', 'celular'];
    function checkFormValidity (){
        const submitButton = document.getElementById('buttom-reservar')
        let isValid = true;
        requiredFields.forEach(id => {
                const field = document.getElementById(id);
                //console.log('fieldvalue: ',field.value);
                if (field && !field.value.trim()) {
                        isValid = false;
                }
        });

        if(isValid){
                submitButton.disabled = false;
        }else {
                submitButton.disabled = true;
        }  
        return isValid
    };

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------Create Final Page---------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    async function populateQrContaine(){
        const qrConatiner = document.getElementById('qr-conatiner');
        qrConatiner.innerHTML = `<div id="qr-image-conatiner" class="qr-image-container">
                                    <img src="./ChampagneShowImages/qr.jpg" alt="" class="logoDivImg"/>
                                </div>
                                <button id="descargarQr" class="submit-button">Descargar QR</button>
                                <p class="qr-container-p">Para finalizar la compra:</p>
                                    
                                </br>
                                    
                                <p class="qr-container-p">DENTRO DE LOS PÓXIMOS</p> 
                                <span class="qr-container-timer" id="timer">10:00</span> 
                                <p class="qr-container-p">MINUTOS</p> 

                                </br>
                                
                                <p class="qr-container-p">
                                    Por favor cancele el monto completo usando el QR que ve en pantalla. 
                                    </br></br> 
                                    Monto a pagar: ${document.getElementById('finalPrice').innerHTML.replace('Precio:', '').trim()}
                                    </br></br> 
                                    Una vez realizado el pago, mande el comprobante de pago directamente al número de whatsApp del evento usando el boton verde de abajo.
                                    </br> 
                                    Luego, el evento se contactara con usted para mandar las entradas.
                                </p>
                                <button id="whatsapp-btn" class="whatsapp-btn">Mandar Mensaje <i class="fab fa-whatsapp"></i></button>
                            `;
                
        document.getElementById('descargarQr').addEventListener('click', () => {
            const img = document.querySelector('#qr-image-conatiner img');
            const imageUrl = img.src;

            // Create a temporary <a> tag to trigger the download
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'QR-Code.jpg'; // You can change the filename here
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });


        document.getElementById('whatsapp-btn').addEventListener('click', () => {
            window.location.href = 'https://wa.me/59177968400';
        });


        let timeLeft = 10 * 60; // 10 minutes in seconds
        const timerElement = document.getElementById('timer');

        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerElement.textContent = "00:00";
                // Optional: you can disable buttons or show an alert
                alert("El tiempo ha expirado. Por favor, vuelva a realizar la reserva");
            }
            timeLeft--;
        };
        updateTimer(); // initial call so it shows 10:00 immediately
        const timerInterval = setInterval(updateTimer, 1000);
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------Finalize reservation------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // Validate form before submission
    async function fetchConsultaInfo(requiredFields, returningInfo, selectedEventInfo, validatedCodes) {
        //console.log('returningInfo: ',returningInfo);
        //console.log('selectedEventInfo: ',selectedEventInfo);

        const recintoInfo = returningInfo.returningData.recintoInfo;
        const layoutData = JSON.parse(recintoInfo[0].seating);
        //console.log('layoutData: ',layoutData);


        //console.log('selectedSeats: ',selectedSeats);

        if(selectedSeats.size<1) return;

        introContainer.classList.add('hidden');
        //header.classList.add('hidden');
        mainContainer.classList.add('hidden');
        footer.classList.add('hidden');
        wrappingMessage.classList.remove('hidden');


        const data = {};
        
        // Handle phone number (optional, if using intlTelInput)
        const phoneNumberInput  = document.getElementById(`celular`);
        const itiInstance = window.intlTelInputGlobals.getInstance(phoneNumberInput);
        const celular = itiInstance.getNumber();
        data['fullPhoneNumber'] = celular.trim();


        const doubleSections = [];
        const singleSections = [];
        const specialSections = [];
        Object.entries(layoutData).forEach(([key, value]) => {
            if (value.isDouble === 1 && value.isSpecial === 0) {
                doubleSections.push(key);
            } else if (value.isDouble === 0 && value.isSpecial === 0) {
                singleSections.push(key);
            } else {
                specialSections.push(key);
            }
        });
        const purchaseSeats = [];
        selectedSeats.forEach(seat =>{
            let finalName;
            const seatNameParts = seat.split('-');
            if (singleSections.some(prefix => seatNameParts[0].startsWith(prefix))){//||seatNameParts[0]=='VipA'||seatNameParts[0]=='VipB'){
                purchaseSeats.push(seat);
            }else if(specialSections.some(prefix => seatNameParts[0].startsWith(prefix))){
                const seatName = seatNameParts[0];
                const seatTimes = seatNameParts[1];
                for(let i=0; i < seatTimes; i++){
                    purchaseSeats.push(seatNameParts[0])
                };
            }else if(doubleSections.some(prefix => seatNameParts[0].startsWith(prefix))){
                const seatParts = seatNameParts[2].split('y')
                const seat1 = `${seatNameParts[0]}-${seatNameParts[1]}-${seatParts[0]}`;
                const seat2 = `${seatNameParts[0]}-${seatNameParts[1]}-${seatParts[1]}`;
                purchaseSeats.push(seat1);
                purchaseSeats.push(seat2);
            }
        })
        data['purchaseSeats'] = purchaseSeats;
        data['eventID'] = eventID;
        data['name'] = document.getElementById('nombre').value;
        data['cost']= document.getElementById('finalPrice').innerHTML.replace('Precio:', '').replace('Bs.', '').trim();

        //-------------------------------------------------------------
        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the `data:*/*;base64,` prefix
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const date = new Date(selectedEventInfo.eventDate);
        const day = date.getUTCDate();
        const month = monthNames[date.getUTCMonth()]; 
        const year = date.getUTCFullYear()
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0'); 
        const formattedDate = `${day} de ${month} de ${year}`
        const formattedHour = `${hours}:${minutes}`

        const earlierDate = new Date(date);
        earlierDate.setUTCMinutes(earlierDate.getUTCMinutes() - 30);
        const earlierHours = earlierDate.getUTCHours();
        const earlierMinutes = earlierDate.getUTCMinutes().toString().padStart(2, '0');
        const formattedHourEarlier = `${earlierHours}:${earlierMinutes}`;

        async function generatePDF() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ format: 'letter' });

            const imagePath = 'IBSImages/IBSLogo.png';
                        const headerImagePath = 'imagenesNativa/n1.jpg';
                        const footerImagePath = 'imagenesNativa/n1.jpg';
                        const imageWidth = 60;
                        const imageHeight = 30;
                        const pageWidth = pdf.internal.pageSize.width;
                        const pageHeight = pdf.internal.pageSize.height;
                        const imageX = (pageWidth - imageWidth) / 2;
                        const imageY = 105;
                        
                        // Add a colored header
                        pdf.setFillColor(2, 82, 149); // Dodger blue color
                        pdf.rect(0, 0, pageWidth, 30, 'F');
                        pdf.setFillColor(230, 210, 123); // Dodger blue color
                        pdf.rect(0, 30, pageWidth, 10, 'F');
                        
                        // Add a colored footer
                        pdf.setFillColor(2, 82, 149); // Dodger blue color
                        pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
                        pdf.setFillColor(230, 210, 123);
                        pdf.rect(0, pageHeight - 40, pageWidth, 10, 'F');

                        pdf.setFillColor(255, 255, 255);
                        pdf.rect(0, 40, pageWidth, pageHeight - 40 - 40, 'F');

                        // Add the watermark image in the center
                        pdf.addImage(imagePath, 'JPEG', imageX, imageY, imageWidth, imageHeight, undefined, 'SLOW');
                        pdf.setFillColor(209, 209, 209); // White overlay
                        pdf.setDrawColor(209, 209, 209); // Optional: outline matches overlay
                        pdf.setGState(new pdf.GState({ opacity: 0.5 })); // Set transparency
                        pdf.rect(imageX, imageY, imageWidth, imageHeight, 'F');
                        pdf.setGState(new pdf.GState({ opacity: 1 }));

                        // Set margins
                        const marginTop = 30 + 20; // Leave space after header
                        const marginLeft = 20;

                        // Title Section
                        pdf.setFont('helvetica', 'bold');
                        pdf.setFontSize(16);
                        pdf.setTextColor(0, 0, 0); // White text for header
                        pdf.text('***ESTO NO ES UN TICKET***', pageWidth / 2, marginTop, { align: 'center' });
                                                 
                        // Main message
                        pdf.setFont('helvetica', 'normal');
                        pdf.setFontSize(12);
                        pdf.setTextColor(0, 0, 0); 
                        let bodyY = marginTop + 20;
                        pdf.text('Gracias por usar nuestro servicio, su reserva está confirmada!', marginLeft, bodyY);
                        pdf.text('Deberá proceder con el pago de las entradas en los siguientes 10 minutos, caso contrario \nla reserva se cancelará.', marginLeft, bodyY + 10);
                        pdf.text('Una vez que el pago haya sido realizado, \nsus entradas serán enviadas de manera digital en los proximos días.', marginLeft, bodyY + 25);
                
                        // User Information
                        pdf.setFont('helvetica', 'bold');
                        pdf.text('Información del Cliente:', marginLeft, bodyY + 40);
                        pdf.setFont('helvetica', 'normal');
                        pdf.text(`Nombre: ${document.getElementById('nombre')?.value || 'N/A'}`, marginLeft, bodyY + 50);
                
                        // Reservation Information
                        pdf.setFont('helvetica', 'bold');
                        pdf.text('Información de la Reserva:', marginLeft, bodyY + 60);
                        pdf.setFont('helvetica', 'normal');
                        pdf.text(`Evento: Champagne Show`, marginLeft, bodyY + 70);
                        pdf.text(`Fecha: ${formattedDate}`, marginLeft, bodyY + 80);
                        pdf.text(`Hora: ${formattedHour}, Ingreso desde las ${formattedHourEarlier}`, marginLeft, bodyY + 90);
                        pdf.text(`Lugar: ${selectedEventInfo.recintoName}`, marginLeft, bodyY + 100);

                        // Reservation Information
                        pdf.setFont('helvetica', 'bold');
                        pdf.text('Información de los asientos:', marginLeft, bodyY + 110);
                        pdf.setFont('helvetica', 'normal');

                        pdf.text(`Monto a pagar: ${document.getElementById('finalPrice').innerHTML.replace('Precio:', '').trim()}`, marginLeft, bodyY + 120);
                        const seatText = purchaseSeats.join(', ');
                        const maxTextWidth = pageWidth - marginLeft * 2;
                        pdf.setFontSize(12);
                        //pdf.text('Asientos:', marginLeft, bodyY + 130);
                        pdf.text(`Asientos: ${seatText}`, marginLeft, bodyY + 130, {
                            maxWidth: maxTextWidth
                        });
                        //
    
                        // Footer Text
                        pdf.setFont('helvetica', 'italic');
                        pdf.setFontSize(10);
                        pdf.setTextColor(0, 0, 0);
                        const footerY3 = pageHeight - 10 - 35; // Start of footer text
                        pdf.text('Gracias por confiar en nuestro servicio de reservas.', pageWidth / 2, footerY3, { align: 'center' });
                        // Save the PDF and trigger download
                        //pdf.save(`Confirmacion-Reservacion-.pdf`);

            // Generate Blob instead of directly saving
            const pdfBlob = pdf.output('blob');
            return pdfBlob;
        }
        const pdfBlob  = await generatePDF();
        const pdfFile = new File([pdfBlob], "Confirmacion-Reservacion.pdf", { type: "application/pdf" });

        data['pdfFile'] = await fileToBase64(pdfFile);
        //-------------------------------------------------------------
       
        
        let errorMessage;
        try {
            wrappingMessage.innerText = '\n\n\nEstamos procesando su solicitud...';

            
            //console.log('data: ',data);
            const response = await fetch('https://zz-eventos-form-answer-processor-test-250829126208.southamerica-west1.run.app', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok){ // if (1) {//
                if (validatedCodes.length > 0) {
                    let asientosPagadosRequeridos = calculatePaidSeatsCount(selectedSeats, layoutData, codeFreeSections);

                    const decrementPromises = [];

                    for (const codigoData of validatedCodes) {
                        if (asientosPagadosRequeridos <= 0) {
                            break; // No more seats to account for
                        }

                        const cantidadADescontar = Math.min(asientosPagadosRequeridos, codigoData.entradas_disponibles);

                        if (cantidadADescontar > 0) {
                            decrementPromises.push(
                                fetch(`http://eventoibs.levosolution.com/api/codigos/${codigoData.codigo}/decrementar_entradas/`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ cantidad: cantidadADescontar }),
                                })
                            );
                            asientosPagadosRequeridos -= cantidadADescontar;
                        }
                    }

                    try {
                        const results = await Promise.all(decrementPromises);
                        results.forEach(res => {
                            if (!res.ok) {
                                console.error('Error al decrementar entradas para un código:', res.status);
                            }
                        });
                    } catch (error) {
                        console.error('Error al actualizar uno o más códigos:', error);
                        // Aquí podrías manejar el error, quizás revirtiendo la reserva principal si es posible.
                    }
                }

                await populateQrContaine();
                wrappingMessage.innerText = '\n\n\nSu Reseva ha sido recibida!';
                document.getElementById('qr-conatiner').classList.remove('hidden');
                //handleRedirectButton()
            }else{
                wrappingMessage.innerText = '\n\n\nEstimado cliente, es posible que otro cliente haya realizado la reserva de los asientos seleccionados durante este periodo, por favor seleccione nuevos asientos e intente de nuevo';
            }

        } catch (error) {
            // Show error popup
            console.log('error: ', error);
            wrappingMessage.innerText = '\n\n\nEstimado cliente, es posible que otro cliente haya realizado la reserva de los asientos seleccionados durante este periodo, por favor seleccione nuevos asientos e intente de nuevo';
            //handleRedirectButton();
        }
       
    };


    function handleRedirectButton() {
        // Add trigger for redirect after 5 seconds
        /*setTimeout(() => {
            window.location.href = 'https://wa.me/59177968400';
        }, 5000);*/
    }
    
});