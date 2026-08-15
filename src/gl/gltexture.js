//WebGL reprentation of an image
export default class GlTexture {
    constructor(gl, file, image) {
        this.tex = gl.createTexture();
        this.dirty = true;

        this.image = new Image();
        this.image.onload  = () => this.setup(gl);

        this.image.src = file;
    }

    setup(gl){
        //var anisotropyExtension = gl.getExtension("EXT_texture_filter_anisotropic");
        gl.bindTexture(gl.TEXTURE_2D, this.tex);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
        //gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //if (anisotropyExtension) gl.texParameteri(gl.TEXTURE_2D, anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT, 8);
        this.dirty = false;
    }
}
