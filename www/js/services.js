angular.module('starter')
.factory('FileService',function(){
	var images;
	var KEY_STORAGE_IMAGES = 'images';

	function getImages(){
		var img = window.localStorage.getItem(KEY_STORAGE_IMAGES);
		if(img){
			images = JSON.parse(img);
		}else{
			images = [];
		}
		return images;
	};
	function addImage(img){
		images.push(img);
		window.localStorage.setItem(KEY_STORAGE_IMAGES, JSON.stringify(images));
	};

	return {
		storeImage: addImage, 
		image: getImages
	};
})
.factory('ImageService',function($cordovaCamera, FileService, $q, $cordovaFile){
	function makeId(){
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (var i = 0; i < 5; i++) {
			text += possible.charAt(Math.random() * possible.length);
		};
		return text;
	};

	function optionsForType(type){
		var source;
		switch(type){
			case 0:
				source = Camera.PictureSourceType.CAMERA;
				break;
			case 1:
				source = Camera.PictureSourceType.PHOTOLIBRARY;
				break;
		}
		return {
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: source,
			allowEdit: false,
			encodingType: Camera.EncodingType.JPEG,
			popoverOptions: Camera.PopoverOptions,
			salveToPhotoAlbum: false
		};
	};

	function saveMedia(type){
		return $q(function(resolve, reject){
			var options = optionsForType(type);
			$cordovaCamera.getPicture(options).then(function(imageUrl){
				var name = imageUrl.substr(imageUrl.lastIndexOf('/')+1);
				var namePath = imageUrl.substr(0,imageUrl.lastIndexOf('/')+1);
				var newName = makeId() + name;
				$cordovaFile.copyFile(namePath, name,cordova.file.dataDirectory, newName).then(function(info){
					FileService.storeImage(newName);
					resolve();
				},function(e){
					reject();
				});
				
			});
		});
	};

	return {
		handlerMediaDialog: saveMedia
	};
})
;