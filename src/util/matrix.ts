// this is a typescript implementation of the Matrix here:
// https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat3.js

class Matrix
{
	public mat:Float32Array = new Float32Array(9);
	
	public constructor()
	{
		this.identity();
	}
	
	public copy(other:Matrix):Matrix
	{
		this.mat[0] = other.mat[0];
		this.mat[1] = other.mat[1];
		this.mat[2] = other.mat[2];
		this.mat[3] = other.mat[3];
		this.mat[4] = other.mat[4];
		this.mat[5] = other.mat[5];
		this.mat[6] = other.mat[6];
		this.mat[7] = other.mat[7];
		this.mat[8] = other.mat[8];
		return this;
	}
	
	public set(m00:number, m01:number, m02:number, m10:number, m11:number, m12:number, m20:number, m21:number, m22:number):Matrix
	{
		this.mat[0] = m00;
		this.mat[1] = m01;
		this.mat[2] = m02;
		this.mat[3] = m10;
		this.mat[4] = m11;
		this.mat[5] = m12;
		this.mat[6] = m20;
		this.mat[7] = m21;
		this.mat[8] = m22;
		return this;
	}
	
	public identity():Matrix
	{
		this.mat[0] = 1;
		this.mat[1] = 0;
		this.mat[2] = 0;
		this.mat[3] = 0;
		this.mat[4] = 1;
		this.mat[5] = 0;
		this.mat[6] = 0;
		this.mat[7] = 0;
		this.mat[8] = 1;
		return this;
	}
	
	public transpose(other:Matrix):Matrix
	{
		if (this === other) 
		{
			var a01 = other.mat[1], a02 = other.mat[2], a12 = other.mat[5];
			this.mat[1] = other.mat[3];
			this.mat[2] = other.mat[6];
			this.mat[3] = a01;
			this.mat[5] = other.mat[7];
			this.mat[6] = a02;
			this.mat[7] = a12;
		} 
		else 
		{
			this.mat[0] = other.mat[0];
			this.mat[1] = other.mat[3];
			this.mat[2] = other.mat[6];
			this.mat[3] = other.mat[1];
			this.mat[4] = other.mat[4];
			this.mat[5] = other.mat[7];
			this.mat[6] = other.mat[2];
			this.mat[7] = other.mat[5];
			this.mat[8] = other.mat[8];
		}
		return this;
	}
	
	public invert():Matrix
	{
		var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2],
        a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5],
        a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

		if (!det)
			return null;
		det = 1.0 / det;

		this.mat[0] = b01 * det;
		this.mat[1] = (-a22 * a01 + a02 * a21) * det;
		this.mat[2] = (a12 * a01 - a02 * a11) * det;
		this.mat[3] = b11 * det;
		this.mat[4] = (a22 * a00 - a02 * a20) * det;
		this.mat[5] = (-a12 * a00 + a02 * a10) * det;
		this.mat[6] = b21 * det;
		this.mat[7] = (-a21 * a00 + a01 * a20) * det;
		this.mat[8] = (a11 * a00 - a01 * a10) * det;
		return this;
	}
	
	public adjugate():Matrix
	{
		var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2],
        a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5],
        a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8];

		this.mat[0] = (a11 * a22 - a12 * a21);
		this.mat[1] = (a02 * a21 - a01 * a22);
		this.mat[2] = (a01 * a12 - a02 * a11);
		this.mat[3] = (a12 * a20 - a10 * a22);
		this.mat[4] = (a00 * a22 - a02 * a20);
		this.mat[5] = (a02 * a10 - a00 * a12);
		this.mat[6] = (a10 * a21 - a11 * a20);
		this.mat[7] = (a01 * a20 - a00 * a21);
		this.mat[8] = (a00 * a11 - a01 * a10);
		return this;
	}
	
	public detriment():number
	{
		var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2],
        a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5],
        a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8];

    	return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
	}
	
	public multiply(other:Matrix):Matrix
	{
		var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2],
        a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5],
        a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8],

        b00 = other.mat[0], b01 = other.mat[1], b02 = other.mat[2],
        b10 = other.mat[3], b11 = other.mat[4], b12 = other.mat[5],
        b20 = other.mat[6], b21 = other.mat[7], b22 = other.mat[8];

		this.mat[0] = b00 * a00 + b01 * a10 + b02 * a20;
		this.mat[1] = b00 * a01 + b01 * a11 + b02 * a21;
		this.mat[2] = b00 * a02 + b01 * a12 + b02 * a22;

		this.mat[3] = b10 * a00 + b11 * a10 + b12 * a20;
		this.mat[4] = b10 * a01 + b11 * a11 + b12 * a21;
		this.mat[5] = b10 * a02 + b11 * a12 + b12 * a22;

		this.mat[6] = b20 * a00 + b21 * a10 + b22 * a20;
		this.mat[7] = b20 * a01 + b21 * a11 + b22 * a21;
		this.mat[8] = b20 * a02 + b21 * a12 + b22 * a22;
		return this;
	}
	
	public translate(x:number, y:number):Matrix
	{
		var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2],
        a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5],
        a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8];

		this.mat[0] = a00;
		this.mat[1] = a01;
		this.mat[2] = a02;

		this.mat[3] = a10;
		this.mat[4] = a11;
		this.mat[5] = a12;

		this.mat[6] = x * a00 + y * a10 + a20;
		this.mat[7] = x * a01 + y * a11 + a21;
		this.mat[8] = x * a02 + y * a12 + a22;
		return this;
	}
	
	public rotate(rad:number):Matrix
	{
		var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2],
		a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5],
		a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8],

		s = Math.sin(rad),
		c = Math.cos(rad);

		this.mat[0] = c * a00 + s * a10;
		this.mat[1] = c * a01 + s * a11;
		this.mat[2] = c * a02 + s * a12;

		this.mat[3] = c * a10 - s * a00;
		this.mat[4] = c * a11 - s * a01;
		this.mat[5] = c * a12 - s * a02;

		this.mat[6] = a20;
		this.mat[7] = a21;
		this.mat[8] = a22;
		return this;
	}
	
	public scale(x:number, y:number):Matrix
	{
		this.mat[0] = x * this.mat[0];
		this.mat[1] = x * this.mat[1];
		this.mat[2] = x * this.mat[2];

		this.mat[3] = y * this.mat[3];
		this.mat[4] = y * this.mat[4];
		this.mat[5] = y * this.mat[5];
		return this;
	}
	
	public add(other:Matrix):Matrix
	{
		this.mat[0] += other.mat[0];
		this.mat[1] += other.mat[1];
		this.mat[2] += other.mat[2];
		this.mat[3] += other.mat[3];
		this.mat[4] += other.mat[4];
		this.mat[5] += other.mat[5];
		this.mat[6] += other.mat[6];
		this.mat[7] += other.mat[7];
		this.mat[8] += other.mat[8];
		return this;
	}
	
	public subtract(other:Matrix):Matrix
	{
		this.mat[0] -= other.mat[0];
		this.mat[1] -= other.mat[1];
		this.mat[2] -= other.mat[2];
		this.mat[3] -= other.mat[3];
		this.mat[4] -= other.mat[4];
		this.mat[5] -= other.mat[5];
		this.mat[6] -= other.mat[6];
		this.mat[7] -= other.mat[7];
		this.mat[8] -= other.mat[8];
		return this;
	}
	
	public toString():string
	{
		return 'mat3(' + this.mat[0] + ', ' + this.mat[1] + ', ' + this.mat[2] + ', ' +
			this.mat[3] + ', ' + this.mat[4] + ', ' + this.mat[5] + ', ' +
			this.mat[6] + ', ' + this.mat[7] + ', ' + this.mat[8] + ')';
	}
	
	public static fromTranslation(x:number, y:number):Matrix
	{
		let out = new Matrix();
		out.mat[0] = 1;
		out.mat[1] = 0;
		out.mat[2] = 0;
		out.mat[3] = 0;
		out.mat[4] = 1;
		out.mat[5] = 0;
		out.mat[6] = x;
		out.mat[7] = y;
		out.mat[8] = 1;
		return out;
	}
}