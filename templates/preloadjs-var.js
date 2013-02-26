print('var = '+ obj.key +'[\n');
_.forEach(obj.files, function (files, i) {
	print('\t{');
	if (files.src) {
		print('src: "' + files.src + '"' + ', ');
	}
	if (files.id) {
		print('id: "' + files.id + '"' + ', ');
	}
	if (files.type) {
		print('type: createjs.LoadQueue.' + files.type + ', ');
	}
	print('},\n');
});
print('\n];');