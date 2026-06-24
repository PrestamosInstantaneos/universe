var SPREADSHEET_ID = "1UcqAvlY-zkoUNsDCsTcxEyKPV7SCFy9WV0WwHACi16k";

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    Logger.log("Error abriendo hoja por ID: " + e.toString());
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

// Función para autorizar Drive/Sheets en el editor
function autorizarDrive() {
  var folderId = "1OIjMAZWhBUHEScvI_MX6xaSM7dt5Zhb-"; 
  try {
    var folder = DriveApp.getFolderById(folderId);
    Logger.log("Acceso concedido a la carpeta: " + folder.getName());
    var file = folder.createFile("test_auth.txt", "Autorización Exitosa de Drive", MimeType.PLAIN_TEXT);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    DriveApp.removeFile(file); // Limpiar archivo de prueba
    Logger.log("Test de escritura de archivo finalizado con éxito.");
  } catch (e) {
    Logger.log("Error autorizando Drive: " + e.toString());
  }
}

// -------------------------------------------------------------
// 1. LEER DATOS (GET)
// -------------------------------------------------------------
function doGet(e) {
  try {
    var action = e.parameter.action;
    
    // ACCIÓN: OBTENER BEATS Y CONFIGURACIONES
    if (action === "getTracks") {
      var ss = getSpreadsheet();
      var sheet = ss.getSheetByName("Beats") || ss.getSheetByName("beats");
      if (!sheet) {
        sheet = ss.insertSheet("Beats");
      }
      var values = sheet.getDataRange().getValues();
      
      // Auto-popular Beats si la hoja está vacía (solo tiene la cabecera o nada)
      if (values.length <= 1) {
        // Asegurar que el header esté escrito
        sheet.clearContents();
        sheet.appendRow(["ID", "Titulo", "Productor", "Tags", "BPM", "Tonalidad", "Precio", "AudioUrl", "FotoUrl", "FechaSubida", "Expuesto", "Tendencia", "Dropeado"]);
        
        var defaultBeatsList = [
          ["1", "Hard melodic free...", "nToucan", "TRAP, NEÓN", 140, "G# Minor", 10.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", "/images/artist-1.png", new Date().toISOString(), true, true, false],
          ["2", "Lüh rich (Yeat x Ke...", "LokernG", "R&B", 95, "C Major", 9.95, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", "/images/artist-2.png", new Date().toISOString(), true, true, false],
          ["3", "[FREE] DARK MEL...", "Onibur", "DRILL, 808", 142, "D# Minor", 25.00, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", "/images/artist-3.png", new Date().toISOString(), true, true, false],
          ["4", "200 Beats For $50...", "markk aylin", "AFROBEATS", 110, "A Minor", 49.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", "/images/artist-4.png", new Date().toISOString(), true, true, false],
          ["5", "HURRICANE - 1+4 F...", "Gotenkeys", "WAVE", 128, "F Minor", 50.00, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", "/images/artist-5.png", new Date().toISOString(), true, true, false],
          ["6", "\"Arrest\" | 2+3 FREE | Tra...", "junkey", "HOUSE", 124, "A# Minor", 44.95, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", "/images/artist-6.png", new Date().toISOString(), true, true, false],
          ["7", "ICEFIELD BLUE", "ALVIAL", "REGGAETÓN", 98, "E Minor", 29.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", "/images/artist-7.png", new Date().toISOString(), true, true, false],
          ["8", "POLAR WHITE", "ALVIAL", "BOOM BAP", 90, "B Minor", 29.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", "/images/artist-8.png", new Date().toISOString(), true, true, false],
          ["rel-1", "Ghetto Romance", "ALVIAL", "REGGAETÓN, LATIN", 98, "E Minor", 29.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", "/images/artist-7.png", new Date().toISOString(), true, false, true],
          ["rel-2", "Cyber Trap 2099", "LokernG", "TRAP, GLITCH", 140, "C Minor", 19.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", "/images/artist-2.png", new Date().toISOString(), true, false, true],
          ["rel-3", "Afro Chill Vibes", "Markk Aylin", "AFROBEATS, DANCEHALL", 105, "G Major", 39.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", "/images/artist-4.png", new Date().toISOString(), true, false, true],
          ["rel-4", "Drill Symphony", "Onibur", "DRILL, DARK", 144, "D# Minor", 24.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", "/images/artist-3.png", new Date().toISOString(), true, false, true],
          ["rel-5", "Midnight House", "Junkey", "HOUSE, DEEP", 126, "A Minor", 44.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", "/images/artist-6.png", new Date().toISOString(), true, false, true],
          ["rel-6", "Polar Express", "ALVIAL", "BOOM BAP, CLASSIC", 92, "E Minor", 29.99, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", "/images/artist-8.png", new Date().toISOString(), true, false, true]
        ];
        
        for (var k = 0; k < defaultBeatsList.length; k++) {
          sheet.appendRow(defaultBeatsList[k]);
        }
        values = sheet.getDataRange().getValues();
      }
      
      var tracks = [];
      for (var i = 1; i < values.length; i++) {
        var rawTags = values[i][3] || "";
        var tagsArray = rawTags.toString().split(",").map(function(t) { return t.trim().toUpperCase(); }).filter(Boolean);
        
        var expuestoVal = (values[i][10] !== undefined) ? values[i][10] : "";
        var tendenciaVal = (values[i][11] !== undefined) ? values[i][11] : "";
        var dropeadoVal = (values[i][12] !== undefined) ? values[i][12] : "";

        var expuesto = (expuestoVal !== false && expuestoVal !== "FALSE");
        var tendencia = (tendenciaVal !== false && tendenciaVal !== "FALSE");
        var dropeado = (dropeadoVal === true || dropeadoVal === "TRUE");

        tracks.push({
          id: String(values[i][0]),
          title: String(values[i][1]),
          producer: String(values[i][2]),
          tags: tagsArray,
          bpm: Number(values[i][4]) || 120,
          key: String(values[i][5]),
          price: "$" + Number(values[i][6] || 0).toFixed(2),
          audioUrl: String(values[i][7] || ""),
          img: String(values[i][8] || ""),
          dateAdded: String(values[i][9] || ""),
          expuesto: expuesto,
          tendencia: tendencia,
          dropeado: dropeado
        });
      }
      
      // Cargar licencias dinámicas
      var licenses = [];
      var licensesSheet = ss.getSheetByName("Licencias");
      if (!licensesSheet) {
        licensesSheet = ss.insertSheet("Licencias");
        licensesSheet.appendRow(["Tipo", "Nombre", "PriceOffset", "Format", "Condiciones"]);
        var defaultLics = [
          ["basic", "Basic License (MP3)", 0, "MP3", JSON.stringify([
            "Uso no comercial y sin fines de lucro",
            "Límite de 3,000 reproducciones/streams",
            "Distribución física limitada a 100 copias",
            "Derecho a 1 video musical no monetizado",
            "No exclusivo (el beat sigue en venta)"
          ])],
          ["premium", "Premium License (WAV)", 15, "WAV + MP3", JSON.stringify([
            "Uso comercial limitado (plataformas de streaming)",
            "Límite de 10,000 reproducciones/streams",
            "Distribución física limitada a 500 copias",
            "Derecho a 1 video musical monetizado",
            "No exclusivo (el beat sigue en venta)"
          ])],
          ["unlimited", "Unlimited (WAV + STEMS)", 50, "WAV + MP3 + Stems (Trackout)", JSON.stringify([
            "Uso comercial ilimitado en todas las plataformas",
            "Reproducciones y streams ilimitados",
            "Distribución física ilimitada",
            "Videos musicales monetizados ilimitados",
            "Derechos de presentación en vivo ilimitados",
            "No exclusivo (el beat sigue en venta)"
          ])],
          ["exclusive", "Exclusive License (Full Rights)", 200, "WAV + MP3 + Stems + Contrato de Exclusividad", JSON.stringify([
            "Transferencia completa de propiedad y derechos de autor",
            "El beat se retira de la tienda inmediatamente",
            "Uso comercial ilimitado en todos los medios",
            "Derechos exclusivos (nadie más puede comprar este beat)",
            "Contrato legal firmado para derechos de autor"
          ])]
        ];
        for (var k = 0; k < defaultLics.length; k++) {
          licensesSheet.appendRow(defaultLics[k]);
        }
        licenses = defaultLics.map(function(row) {
          return { type: row[0], name: row[1], priceOffset: Number(row[2]), format: row[3], terms: JSON.parse(row[4]) };
        });
      } else {
        var licValues = licensesSheet.getDataRange().getValues();
        for (var l = 1; l < licValues.length; l++) {
          var parsedTerms = [];
          try { parsedTerms = JSON.parse(licValues[l][4] || "[]"); } catch(err) {
            parsedTerms = String(licValues[l][4] || "").split("\n").map(function(t) { return t.trim(); }).filter(Boolean);
          }
          licenses.push({
            type: String(licValues[l][0]),
            name: String(licValues[l][1]),
            priceOffset: Number(licValues[l][2]) || 0,
            format: String(licValues[l][3]),
            terms: parsedTerms
          });
        }
      }
      
      // Cargar ajustes del sitio
      var settings = { logoUrl: "", logoText: "ALVIAL" };
      var settingsSheet = ss.getSheetByName("Ajustes");
      if (!settingsSheet) {
        settingsSheet = ss.insertSheet("Ajustes");
        settingsSheet.appendRow(["Clave", "Valor"]);
        settingsSheet.appendRow(["logoUrl", ""]);
        settingsSheet.appendRow(["logoText", "ALVIAL"]);
      } else {
        var setValues = settingsSheet.getDataRange().getValues();
        for (var s = 1; s < setValues.length; s++) {
          if (setValues[s][0] === "logoUrl") settings.logoUrl = String(setValues[s][1] || "");
          if (setValues[s][0] === "logoText") settings.logoText = String(setValues[s][1] || "ALVIAL");
        }
      }
      
      return jsonResponse({ status: "success", tracks: tracks, licenses: licenses, settings: settings });
    }
    
    // ACCIÓN: OBTENER NOTICIAS
    if (action === "getNews") {
      var ss = getSpreadsheet();
      var sheet = ss.getSheetByName("Noticias");
      if (!sheet) {
        sheet = ss.insertSheet("Noticias");
        sheet.appendRow(["ID", "Titulo", "Descripcion", "Detalle", "FotoUrl", "Enlace", "FechaSubida", "Expuesto", "Tag"]);
      }
      var values = sheet.getDataRange().getValues();
      
      if (values.length <= 1) {
        var defaultNewsList = [
          ["post-1", "Actualización de Verano: 15 Nuevos Beats Melódicos", "El catálogo se ha actualizado con nuevos ritmos de trap y R&B. Escucha los adelantos exclusivos en la sección de drops.", "Nuestros administradores acaban de publicar un lote de 15 instrumentales exclusivos con enfoque melódico, ideales para voces R&B y trap agresivo. Además, se han ajustado los contratos de la licencia Unlimited para otorgar un 10% adicional de regalías en favor del artista en plataformas de streaming. ¡No te pierdas estos nuevos beats e impulso tu siguiente lanzamiento hoy mismo!", "/images/featured.png", "", new Date().toISOString(), true, "NUEVO DROPEO"],
          ["post-2", "2x1 en Licencias Básicas y Premium por Tiempo Limitado", "Añade dos beats con la misma licencia a tu carrito y el descuento se aplicará automáticamente al pagar.", "Queremos apoyar a los artistas independientes este mes. Al añadir cualquier par de beats de la misma categoría de licencia (Basic o Premium) a tu carrito de compras, el sistema de ALVIAL descontará automáticamente el de menor valor. Esta oferta especial estará activa por tiempo limitado y finalizará el 30 de junio. ¡Aprovecha para armar tus maquetas!", "/images/city-banner.png", "", new Date().toISOString(), true, "OFERTA"]
        ];
        for (var j = 0; j < defaultNewsList.length; j++) {
          sheet.appendRow(defaultNewsList[j]);
        }
        values = sheet.getDataRange().getValues();
      }
      
      var news = [];
      for (var i = 1; i < values.length; i++) {
        news.push({
          id: String(values[i][0]),
          title: String(values[i][1]),
          description: String(values[i][2]),
          content: String(values[i][3]),
          image: String(values[i][4]),
          link: String(values[i][5] || ""),
          date: String(values[i][6]),
          expuesto: values[i][7] !== false && values[i][7] !== "FALSE",
          tag: String(values[i][8] || "AVISO")
        });
      }
      return jsonResponse({ status: "success", news: news });
    }
    
    // ACCIÓN: ESTADÍSTICAS DEL PANEL DE ADMINISTRACIÓN
    if (action === "getAdminStats") {
      var ss = getSpreadsheet();
      
      // Cargar usuarios
      var users = [];
      var totalUsers = 0;
      var usersSheet = ss.getSheetByName("Usuarios");
      if (usersSheet) {
        var uValues = usersSheet.getDataRange().getValues();
        totalUsers = Math.max(0, uValues.length - 1);
        for (var i = 1; i < uValues.length; i++) {
          users.push({
            id: String(uValues[i][0] || ""),
            email: String(uValues[i][1] || ""),
            name: String(uValues[i][2] || ""),
            picture: String(uValues[i][3] || ""),
            dateAdded: String(uValues[i][4] || "")
          });
        }
      }
      
      // Cargar carritos
      var cartItems = [];
      var totalCartItems = 0;
      var cartsSheet = ss.getSheetByName("Carritos") || ss.getSheetByName("Carrito");
      if (cartsSheet) {
        var cValues = cartsSheet.getDataRange().getValues();
        totalCartItems = Math.max(0, cValues.length - 1);
        for (var i = 1; i < cValues.length; i++) {
          cartItems.push({
            email: String(cValues[i][0] || ""),
            trackId: String(cValues[i][1] || ""),
            title: String(cValues[i][2] || ""),
            licenseType: String(cValues[i][3] || ""),
            price: Number(cValues[i][4]) || 0,
            selected: cValues[i][5] === true || cValues[i][5] === "TRUE",
            dateAdded: String(cValues[i][6] || "")
          });
        }
      }
      
      return jsonResponse({
        status: "success",
        stats: {
          totalUsers: totalUsers,
          totalCartItems: totalCartItems,
          users: users,
          cartItems: cartItems
        }
      });
    }
    
    return jsonResponse({ status: "error", message: "Acción GET no válida" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// -------------------------------------------------------------
// 2. ESCRIBIR DATOS (POST)
// -------------------------------------------------------------
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var ss = getSpreadsheet();
    
    // LOGIN
    if (action === "login") {
      var token = data.idToken;
      if (!token) {
        return jsonResponse({ status: "error", message: "Token no proporcionado" });
      }
      
      try {
        var tokenResponse = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + token);
        var tokenInfo = JSON.parse(tokenResponse.getContentText());
        var email = tokenInfo.email;
        var name = tokenInfo.name || "";
        var picture = tokenInfo.picture || "";
        var userId = tokenInfo.sub;
        
        if (!email) {
          return jsonResponse({ status: "error", message: "No se pudo obtener el email del token" });
        }
        
        var sheet = ss.getSheetByName("Usuarios");
        if (!sheet) {
          sheet = ss.insertSheet("Usuarios");
          sheet.appendRow(["UID", "Email", "Nombre", "Foto", "FechaCreacion"]);
        }
        var values = sheet.getDataRange().getValues();
        var found = false;
        
        for (var i = 1; i < values.length; i++) {
          if (values[i][1] === email) {
            found = true;
            if (name && values[i][2] !== name) sheet.getRange(i + 1, 3).setValue(name);
            if (picture && values[i][3] !== picture) sheet.getRange(i + 1, 4).setValue(picture);
            break;
          }
        }
        
        if (!found) {
          sheet.appendRow([userId, email, name, picture, new Date().toISOString()]);
        }
        
        // Obtener el carrito sincronizado
        var userCart = [];
        var cartsSheet = ss.getSheetByName("Carritos") || ss.getSheetByName("Carrito");
        if (cartsSheet) {
          var cValues = cartsSheet.getDataRange().getValues();
          for (var i = 1; i < cValues.length; i++) {
            if (cValues[i][0] === email) {
              userCart.push({
                trackId: String(cValues[i][1]),
                title: String(cValues[i][2]),
                licenseType: String(cValues[i][3]),
                price: Number(cValues[i][4]) || 0,
                selected: cValues[i][5] === true || cValues[i][5] === "TRUE"
              });
            }
          }
        }
        
        return jsonResponse({
          status: "success",
          user: {
            uid: userId,
            email: email,
            name: name,
            picture: picture
          },
          cart: userCart
        });
      } catch (err) {
        return jsonResponse({ status: "error", message: "Error al validar login de Google: " + err.toString() });
      }
    }
    
    // SINCRONIZAR CARRITO
    if (action === "syncCart") {
      var email = data.email;
      var cart = data.cart || [];
      if (!email) {
        return jsonResponse({ status: "error", message: "Email requerido para sincronizar" });
      }
      
      var sheet = ss.getSheetByName("Carritos") || ss.getSheetByName("Carrito");
      if (!sheet) {
        sheet = ss.insertSheet("Carritos");
        sheet.appendRow(["Email", "TrackId", "Titulo", "LicenseType", "Price", "Selected", "Fecha"]);
      }
      var values = sheet.getDataRange().getValues();
      
      // Borrar registros anteriores (de atrás hacia adelante)
      for (var i = values.length - 1; i >= 1; i--) {
        if (values[i][0] === email) {
          sheet.deleteRow(i + 1);
        }
      }
      
      // Guardar nuevos
      for (var j = 0; j < cart.length; j++) {
        var item = cart[j];
        sheet.appendRow([
          email,
          String(item.trackId),
          String(item.title || ""),
          String(item.licenseType || ""),
          Number(item.price) || 0,
          item.selected === true || item.selected === "TRUE",
          new Date().toISOString()
        ]);
      }
      return jsonResponse({ status: "success", message: "Carrito sincronizado" });
    }
    
    // SUBIR NUEVO BEAT
    if (action === "uploadBeat") {
      var folderId = data.folderId;
      var title = data.title;
      var producer = data.producer;
      var price = Number(data.price) || 0;
      var bpm = Number(data.bpm) || 120;
      var key = data.key || "";
      var tags = data.tags || "";
      var expuesto = data.expuesto !== false;
      var tendencia = data.tendencia !== false;
      var dropeado = data.dropeado === true;
      
      if (!folderId) {
        return jsonResponse({ status: "error", message: "Drive Folder ID requerido" });
      }
      var folder = DriveApp.getFolderById(folderId);
      
      var imgUrl = "";
      if (data.imageData && data.imageMime) {
        var imgBlob = Utilities.newBlob(Utilities.base64Decode(data.imageData), data.imageMime, data.imageName || "cover.png");
        var imgFile = folder.createFile(imgBlob);
        imgFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        imgUrl = "https://lh3.googleusercontent.com/d/" + imgFile.getId();
      }
      
      var audioUrl = "";
      if (data.audioData && data.audioMime) {
        var audioBlob = Utilities.newBlob(Utilities.base64Decode(data.audioData), data.audioMime, data.audioName || "track.mp3");
        var audioFile = folder.createFile(audioBlob);
        audioFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        audioUrl = "https://lh3.googleusercontent.com/d/" + audioFile.getId();
      }
      
      var sheet = ss.getSheetByName("Beats") || ss.getSheetByName("beats") || ss.getSheets()[0];
      var values = sheet.getDataRange().getValues();
      var maxId = 0;
      for (var i = 1; i < values.length; i++) {
        var numericId = parseInt(values[i][0], 10);
        if (!isNaN(numericId) && numericId > maxId) {
          maxId = numericId;
        }
      }
      var newId = String(maxId + 1);
      
      sheet.appendRow([
        newId,
        title,
        producer,
        tags,
        bpm,
        key,
        price,
        audioUrl,
        imgUrl,
        new Date().toISOString(),
        expuesto,
        tendencia,
        dropeado
      ]);
      
      return jsonResponse({ status: "success", message: "Beat subido exitosamente", id: newId });
    }
    
    // MODIFICAR BEAT
    if (action === "updateBeat") {
      var id = data.id;
      var title = data.title;
      var producer = data.producer;
      var price = Number(data.price) || 0;
      var bpm = Number(data.bpm) || 120;
      var key = data.key || "";
      var tags = data.tags || "";
      var expuesto = data.expuesto !== false;
      var tendencia = data.tendencia !== false;
      var dropeado = data.dropeado === true;
      var folderId = data.folderId;
      
      var sheet = ss.getSheetByName("Beats") || ss.getSheetByName("beats") || ss.getSheets()[0];
      var values = sheet.getDataRange().getValues();
      var foundRow = -1;
      
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(id)) {
          foundRow = i + 1;
          break;
        }
      }
      
      if (foundRow === -1) {
        // Auto-crear beat por defecto si no existe en la hoja para poder actualizarlo
        var defaultBeat = getDefaultBeatById(id);
        if (defaultBeat) {
          var imgUrl = defaultBeat.img;
          if (data.imageData && data.imageMime && folderId) {
            var folder = DriveApp.getFolderById(folderId);
            var imgBlob = Utilities.newBlob(Utilities.base64Decode(data.imageData), data.imageMime, data.imageName || "cover.png");
            var imgFile = folder.createFile(imgBlob);
            imgFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            imgUrl = "https://lh3.googleusercontent.com/d/" + imgFile.getId();
          }
          
          sheet.appendRow([
            id,
            title,
            producer,
            tags,
            bpm,
            key,
            price,
            defaultBeat.audioUrl,
            imgUrl,
            new Date().toISOString(),
            expuesto,
            tendencia,
            dropeado
          ]);
          return jsonResponse({ status: "success", message: "Beat por defecto registrado y actualizado" });
        }
        return jsonResponse({ status: "error", message: "Beat no encontrado en la base de datos" });
      }
      
      sheet.getRange(foundRow, 2).setValue(title);
      sheet.getRange(foundRow, 3).setValue(producer);
      sheet.getRange(foundRow, 4).setValue(tags);
      sheet.getRange(foundRow, 5).setValue(bpm);
      sheet.getRange(foundRow, 6).setValue(key);
      sheet.getRange(foundRow, 7).setValue(price);
      sheet.getRange(foundRow, 11).setValue(expuesto);
      sheet.getRange(foundRow, 12).setValue(tendencia);
      sheet.getRange(foundRow, 13).setValue(dropeado);
      
      if (data.imageData && data.imageMime && folderId) {
        var folder = DriveApp.getFolderById(folderId);
        var imgBlob = Utilities.newBlob(Utilities.base64Decode(data.imageData), data.imageMime, data.imageName || "cover.png");
        var imgFile = folder.createFile(imgBlob);
        imgFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        var imgUrl = "https://lh3.googleusercontent.com/d/" + imgFile.getId();
        sheet.getRange(foundRow, 9).setValue(imgUrl);
      }
      
      return jsonResponse({ status: "success", message: "Beat actualizado exitosamente" });
    }
    
    // PUBLICAR NOTICIA
    if (action === "uploadNews") {
      var folderId = data.folderId;
      var title = data.title;
      var tag = data.tag || "NUEVO DROPEO";
      var description = data.description || "";
      var content = data.content || "";
      var link = data.link || "";
      var expuesto = data.expuesto !== false;
      
      var imgUrl = "";
      if (data.imageData && data.imageMime && folderId) {
        var folder = DriveApp.getFolderById(folderId);
        var imgBlob = Utilities.newBlob(Utilities.base64Decode(data.imageData), data.imageMime, data.imageName || "news.png");
        var imgFile = folder.createFile(imgBlob);
        imgFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        imgUrl = "https://lh3.googleusercontent.com/d/" + imgFile.getId();
      }
      
      var sheet = ss.getSheetByName("Noticias") || ss.insertSheet("Noticias");
      var values = sheet.getDataRange().getValues();
      var maxId = 0;
      for (var i = 1; i < values.length; i++) {
        var rawId = String(values[i][0]);
        var numericId = parseInt(rawId.replace("post-", ""), 10);
        if (!isNaN(numericId) && numericId > maxId) {
          maxId = numericId;
        }
      }
      var newId = "post-" + (maxId + 1);
      
      sheet.appendRow([
        newId,
        title,
        description,
        content,
        imgUrl,
        link,
        new Date().toISOString(),
        expuesto,
        tag
      ]);
      
      return jsonResponse({ status: "success", message: "Noticia publicada con éxito", id: newId });
    }
    
    // MODIFICAR NOTICIA
    if (action === "updateNews") {
      var id = data.id;
      var title = data.title;
      var tag = data.tag || "NUEVO DROPEO";
      var description = data.description || "";
      var content = data.content || "";
      var link = data.link || "";
      var expuesto = data.expuesto !== false;
      var folderId = data.folderId;
      
      var sheet = ss.getSheetByName("Noticias") || ss.insertSheet("Noticias");
      var values = sheet.getDataRange().getValues();
      var foundRow = -1;
      
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(id)) {
          foundRow = i + 1;
          break;
        }
      }
      
      if (foundRow === -1) {
        // Auto-crear noticia por defecto si no existe en la hoja para poder actualizarla
        var defaultNews = getDefaultNewsById(id);
        if (defaultNews) {
          var imgUrl = defaultNews.image;
          if (data.imageData && data.imageMime && folderId) {
            var folder = DriveApp.getFolderById(folderId);
            var imgBlob = Utilities.newBlob(Utilities.base64Decode(data.imageData), data.imageMime, data.imageName || "news.png");
            var imgFile = folder.createFile(imgBlob);
            imgFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            imgUrl = "https://lh3.googleusercontent.com/d/" + imgFile.getId();
          }
          
          sheet.appendRow([
            id,
            title,
            description,
            content,
            imgUrl,
            link,
            new Date().toISOString(),
            expuesto,
            tag
          ]);
          return jsonResponse({ status: "success", message: "Noticia por defecto registrada y actualizada" });
        }
        return jsonResponse({ status: "error", message: "Noticia no encontrada" });
      }
      
      sheet.getRange(foundRow, 2).setValue(title);
      sheet.getRange(foundRow, 3).setValue(description);
      sheet.getRange(foundRow, 4).setValue(content);
      sheet.getRange(foundRow, 6).setValue(link);
      sheet.getRange(foundRow, 8).setValue(expuesto);
      sheet.getRange(foundRow, 9).setValue(tag);
      
      if (data.imageData && data.imageMime && folderId) {
        var folder = DriveApp.getFolderById(folderId);
        var imgBlob = Utilities.newBlob(Utilities.base64Decode(data.imageData), data.imageMime, data.imageName || "news.png");
        var imgFile = folder.createFile(imgBlob);
        imgFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        var imgUrl = "https://lh3.googleusercontent.com/d/" + imgFile.getId();
        sheet.getRange(foundRow, 5).setValue(imgUrl);
      }
      
      return jsonResponse({ status: "success", message: "Noticia actualizada con éxito" });
    }
    
    // TOGGLES DE ESTADO RÁPIDOS
    if (action === "toggleStatus") {
      var id = data.id;
      var type = data.type; // "beats" o "news"
      var field = data.field; // "expuesto", "tendencia" o "dropeado"
      
      if (type === "beats") {
        var sheet = ss.getSheetByName("Beats") || ss.getSheetByName("beats") || ss.getSheets()[0];
        var values = sheet.getDataRange().getValues();
        var foundRow = -1;
        
        var colIndex = -1;
        if (field === "expuesto") colIndex = 11;
        else if (field === "tendencia") colIndex = 12;
        else if (field === "dropeado") colIndex = 13;
        
        if (colIndex === -1) {
          return jsonResponse({ status: "error", message: "Campo no reconocido para Beats" });
        }
        
        for (var i = 1; i < values.length; i++) {
          if (String(values[i][0]) === String(id)) {
            foundRow = i + 1;
            break;
          }
        }
        
        var newValue = false;
        if (foundRow !== -1) {
          var currentValue = values[foundRow - 1][colIndex - 1];
          // Si el valor actual está vacío, dependemos del tipo de campo para el valor inicial
          if (currentValue === "") {
            newValue = (field === "expuesto" || field === "tendencia") ? false : true;
          } else {
            newValue = !(currentValue === true || currentValue === "TRUE");
          }
          sheet.getRange(foundRow, colIndex).setValue(newValue);
          return jsonResponse({ status: "success", message: "Estado de beat actualizado" });
        } else {
          // Si no se encuentra, pero es beat por defecto, lo escribimos con el toggle aplicado
          var defaultBeat = getDefaultBeatById(id);
          if (defaultBeat) {
            var defaultExpuesto = true;
            var defaultTendencia = true;
            var defaultDropeado = false;
            
            // Si es la sección de lanzamientos (rel-1 a rel-6), tendencia es falso y dropeado es verdadero
            if (String(id).indexOf("rel-") === 0) {
              defaultTendencia = false;
              defaultDropeado = true;
            }
            
            if (field === "expuesto") defaultExpuesto = !defaultExpuesto;
            if (field === "tendencia") defaultTendencia = !defaultTendencia;
            if (field === "dropeado") defaultDropeado = !defaultDropeado;
            
            sheet.appendRow([
              defaultBeat.id,
              defaultBeat.title,
              defaultBeat.producer,
              defaultBeat.tags.join(", "),
              defaultBeat.bpm,
              defaultBeat.key,
              defaultBeat.price.replace("$", ""),
              defaultBeat.audioUrl,
              defaultBeat.img,
              new Date().toISOString(),
              defaultExpuesto,
              defaultTendencia,
              defaultDropeado
            ]);
            return jsonResponse({ status: "success", message: "Beat por defecto creado y estado actualizado" });
          }
          return jsonResponse({ status: "error", message: "Beat no encontrado en la hoja de cálculo" });
        }
      }
      
      if (type === "news") {
        var sheet = ss.getSheetByName("Noticias");
        if (!sheet) {
          return jsonResponse({ status: "error", message: "Hoja de Noticias no disponible" });
        }
        var values = sheet.getDataRange().getValues();
        var foundRow = -1;
        
        for (var i = 1; i < values.length; i++) {
          if (String(values[i][0]) === String(id)) {
            foundRow = i + 1;
            break;
          }
        }
        
        if (foundRow !== -1) {
          var colIndex = 8; // Columna H (Expuesto)
          var currentValue = values[foundRow - 1][colIndex - 1];
          var newValue = !(currentValue === true || currentValue === "TRUE");
          sheet.getRange(foundRow, colIndex).setValue(newValue);
          return jsonResponse({ status: "success", message: "Estado de noticia actualizado" });
        } else {
          var defaultNews = getDefaultNewsById(id);
          if (defaultNews) {
            var defaultExpuesto = false; // toggle de activo a inactivo
            sheet.appendRow([
              defaultNews.id,
              defaultNews.title,
              defaultNews.description,
              defaultNews.content,
              defaultNews.image,
              "",
              new Date().toISOString(),
              defaultExpuesto,
              defaultNews.tag
            ]);
            return jsonResponse({ status: "success", message: "Noticia por defecto creada y estado actualizado" });
          }
          return jsonResponse({ status: "error", message: "Noticia no encontrada" });
        }
      }
      
      return jsonResponse({ status: "error", message: "Tipo no válido para toggleStatus" });
    }
    
    // ACTUALIZAR LOGOTIPO DEL SITIO
    if (action === "updateSettings") {
      var settingsSheet = ss.getSheetByName("Ajustes") || ss.insertSheet("Ajustes");
      var logoUrl = data.existingLogo || "";
      var folderId = data.folderId;
      
      if (data.imageData && data.imageMime && folderId) {
        var folder = DriveApp.getFolderById(folderId);
        var imgBlob = Utilities.newBlob(Utilities.base64Decode(data.imageData), data.imageMime, data.imageName || "logo.png");
        var imgFile = folder.createFile(imgBlob);
        imgFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        logoUrl = "https://lh3.googleusercontent.com/d/" + imgFile.getId();
      }
      
      var range = settingsSheet.getDataRange();
      var values = range.getValues();
      var foundLogoUrl = false;
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === "logoUrl") {
          settingsSheet.getRange(i + 1, 2).setValue(logoUrl);
          foundLogoUrl = true;
          break;
        }
      }
      if (!foundLogoUrl) {
        if (values.length === 1 && values[0][0] === "") {
          settingsSheet.appendRow(["Clave", "Valor"]);
        }
        settingsSheet.appendRow(["logoUrl", logoUrl]);
      }
      return jsonResponse({ status: "success", message: "Configuraciones guardadas", logoUrl: logoUrl });
    }
    
    // GUARDAR PLANTILLAS DE LICENCIAS
    if (action === "updateLicenses") {
      var licensesSheet = ss.getSheetByName("Licencias") || ss.insertSheet("Licencias");
      var numRows = licensesSheet.getLastRow();
      if (numRows > 1) {
        licensesSheet.deleteRows(2, numRows - 1);
      }
      var incomingLics = data.licenses || [];
      for (var k = 0; k < incomingLics.length; k++) {
        var item = incomingLics[k];
        licensesSheet.appendRow([
          item.type,
          item.name,
          Number(item.priceOffset) || 0,
          item.format,
          JSON.stringify(item.terms || [])
        ]);
      }
      return jsonResponse({ status: "success", message: "Plantillas de licencias actualizadas" });
    }
    
    // COMPRA EXCLUSIVA
    if (action === "sellExclusiveBeat") {
      var trackId = data.id;
      var sheet = ss.getSheetByName("Beats") || ss.getSheetByName("beats") || ss.getSheets()[0];
      var values = sheet.getDataRange().getValues();
      var foundRow = -1;
      
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(trackId)) {
          foundRow = i + 1;
          break;
        }
      }
      
      if (foundRow !== -1) {
        sheet.getRange(foundRow, 11).setValue(false); // Expuesto = FALSE
        return jsonResponse({ status: "success", message: "Beat exclusive vendido y despublicado automáticamente" });
      } else {
        var defaultBeat = getDefaultBeatById(trackId);
        if (defaultBeat) {
          var defaultTendencia = true;
          var defaultDropeado = false;
          if (String(trackId).indexOf("rel-") === 0) {
            defaultTendencia = false;
            defaultDropeado = true;
          }
          sheet.appendRow([
            defaultBeat.id,
            defaultBeat.title,
            defaultBeat.producer,
            defaultBeat.tags.join(", "),
            defaultBeat.bpm,
            defaultBeat.key,
            defaultBeat.price.replace("$", ""),
            defaultBeat.audioUrl,
            defaultBeat.img,
            new Date().toISOString(),
            false, // Expuesto = FALSE
            defaultTendencia,
            defaultDropeado
          ]);
          return jsonResponse({ status: "success", message: "Beat por defecto creado y despublicado automáticamente" });
        }
      }
      return jsonResponse({ status: "error", message: "Beat no encontrado en la hoja" });
    }
    
    return jsonResponse({ status: "error", message: "Acción POST no reconocida" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// -------------------------------------------------------------
// 3. RESPUESTAS JSON Y CABECERAS DE CORS
// -------------------------------------------------------------
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

// -------------------------------------------------------------
// 4. METADATA DE LOS BEATS POR DEFECTO
// -------------------------------------------------------------
function getDefaultBeatById(id) {
  var list = [
    { id: "1", title: "Hard melodic free...", producer: "nToucan", tags: ["TRAP", "NEÓN"], bpm: 140, key: "G# Minor", price: "10.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", img: "/images/artist-1.png" },
    { id: "2", title: "Lüh rich (Yeat x Ke...", producer: "LokernG", tags: ["R&B"], bpm: 95, key: "C Major", price: "9.95", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", img: "/images/artist-2.png" },
    { id: "3", title: "[FREE] DARK MEL...", producer: "Onibur", tags: ["DRILL", "808"], bpm: 142, key: "D# Minor", price: "25.00", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", img: "/images/artist-3.png" },
    { id: "4", title: "200 Beats For $50...", producer: "markk aylin", tags: ["AFROBEATS"], bpm: 110, key: "A Minor", price: "49.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", img: "/images/artist-4.png" },
    { id: "5", title: "HURRICANE - 1+4 F...", producer: "Gotenkeys", tags: ["WAVE"], bpm: 128, key: "F Minor", price: "50.00", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", img: "/images/artist-5.png" },
    { id: "6", title: "\"Arrest\" | 2+3 FREE | Tra...", producer: "junkey", tags: ["HOUSE"], bpm: 124, key: "A# Minor", price: "44.95", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", img: "/images/artist-6.png" },
    { id: "7", title: "ICEFIELD BLUE", producer: "ALVIAL", tags: ["REGGAETÓN"], bpm: 98, key: "E Minor", price: "29.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", img: "/images/artist-7.png" },
    { id: "8", title: "POLAR WHITE", producer: "ALVIAL", tags: ["BOOM BAP"], bpm: 90, key: "B Minor", price: "29.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", img: "/images/artist-8.png" },
    { id: "rel-1", title: "Ghetto Romance", producer: "ALVIAL", tags: ["REGGAETÓN", "LATIN"], bpm: 98, key: "E Minor", price: "29.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", img: "/images/artist-7.png" },
    { id: "rel-2", title: "Cyber Trap 2099", producer: "LokernG", tags: ["TRAP", "GLITCH"], bpm: 140, key: "C Minor", price: "19.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", img: "/images/artist-2.png" },
    { id: "rel-3", title: "Afro Chill Vibes", producer: "Markk Aylin", tags: ["AFROBEATS", "DANCEHALL"], bpm: 105, key: "G Major", price: "39.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", img: "/images/artist-4.png" },
    { id: "rel-4", title: "Drill Symphony", producer: "Onibur", tags: ["DRILL", "DARK"], bpm: 144, key: "D# Minor", price: "24.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", img: "/images/artist-3.png" },
    { id: "rel-5", title: "Midnight House", producer: "Junkey", tags: ["HOUSE", "DEEP"], bpm: 126, key: "A Minor", price: "44.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", img: "/images/artist-6.png" },
    { id: "rel-6", title: "Polar Express", producer: "ALVIAL", tags: ["BOOM BAP", "CLASSIC"], bpm: 92, key: "E Minor", price: "29.99", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", img: "/images/artist-8.png" }
  ];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
}

// -------------------------------------------------------------
// 5. METADATA DE LAS NOTICIAS POR DEFECTO
// -------------------------------------------------------------
function getDefaultNewsById(id) {
  var list = [
    {
      id: "post-1",
      title: "Actualización de Verano: 15 Nuevos Beats Melódicos",
      tag: "NUEVO DROPEO",
      description: "El catálogo se ha actualizado con nuevos ritmos de trap y R&B. Escucha los adelantos exclusivos en la sección de drops.",
      content: "Nuestros administradores acaban de publicar un lote de 15 instrumentales exclusivos con enfoque melódico, ideales para voces R&B y trap agresivo. Además, se han ajustado los contratos de la licencia Unlimited para otorgar un 10% adicional de regalías en favor del artista en plataformas de streaming. ¡No te pierdas estos nuevos beats e impulso tu siguiente lanzamiento hoy mismo!",
      image: "/images/featured.png"
    },
    {
      id: "post-2",
      title: "2x1 en Licencias Básicas y Premium por Tiempo Limitado",
      tag: "OFERTA",
      description: "Añade dos beats con la misma licencia a tu carrito y el descuento se aplicará automáticamente al pagar.",
      content: "Queremos apoyar a los artistas independientes este mes. Al añadir cualquier par de beats de la misma categoría de licencia (Basic o Premium) a tu carrito de compras, el sistema de ALVIAL descontará automáticamente el de menor valor. Esta oferta especial estará activa por tiempo limitado y finalizará el 30 de junio. ¡Aprovecha para armar tus maquetas!",
      image: "/images/city-banner.png"
    }
  ];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
}
