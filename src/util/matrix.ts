class Matrix
{

	public mat:Float32Array = new Float32Array(9);

	public constructor()
	{
		this.identity();
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

	public copy(o:Matrix):Matrix
	{
		this.mat[0] = o.mat[0];
		this.mat[1] = o.mat[1];
		this.mat[2] = o.mat[2];
		this.mat[3] = o.mat[3];
		this.mat[4] = o.mat[4];
		this.mat[5] = o.mat[5];
		this.mat[6] = o.mat[6];
		this.mat[7] = o.mat[7];
		this.mat[8] = o.mat[8];
		return this;
	}

	public set(a:number, b:number, c:number, d:number, tx:number, ty:number):Matrix
	{
		this.mat[0] = a;
		this.mat[1] = d;
		this.mat[2] = 0;
		this.mat[3] = c;
		this.mat[4] = b;
		this.mat[5] = 0;
		this.mat[6] = tx;
		this.mat[7] = ty;
		this.mat[8] = 1;
		return this;
	}

	public add(o:Matrix):Matrix
	{
		this.mat[0] += o.mat[0];
		this.mat[1] += o.mat[1];
		this.mat[2] += o.mat[2];
		this.mat[3] += o.mat[3];
		this.mat[4] += o.mat[4];
		this.mat[5] += o.mat[5];
		this.mat[6] += o.mat[6];
		this.mat[7] += o.mat[7];
		this.mat[8] += o.mat[8];
		return this;
	}

	public sub(o:Matrix):Matrix
	{
		this.mat[0] -= o.mat[0];
		this.mat[1] -= o.mat[1];
		this.mat[2] -= o.mat[2];
		this.mat[3] -= o.mat[3];
		this.mat[4] -= o.mat[4];
		this.mat[5] -= o.mat[5];
		this.mat[6] -= o.mat[6];
		this.mat[7] -= o.mat[7];
		this.mat[8] -= o.mat[8];
		return this;
	}

	public scaler(s:number):Matrix
	{
		this.mat[0] *= s;
		this.mat[1] *= s;
		this.mat[2] *= s;
		this.mat[3] *= s;
		this.mat[4] *= s;
		this.mat[5] *= s;
		this.mat[6] *= s;
		this.mat[7] *= s;
		this.mat[8] *= s;
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
			det = a00 * b01 + a01 * b11 + a02 * b21;

		if (!det)
			return this;
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

	public multiply(o:Matrix):Matrix
	{
		var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2],
			a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5],
			a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8],

			b00 = o.mat[0], b01 = o.mat[1], b02 = o.mat[2],
			b10 = o.mat[3], b11 = o.mat[4], b12 = o.mat[5],
			b20 = o.mat[6], b21 = o.mat[7], b22 = o.mat[8];

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

	public rotate(rad:number):Matrix
	{
		var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2],
			a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5],
			s = Math.sin(rad),
			c = Math.cos(rad);

		this.mat[0] = c * a00 + s * a10;
		this.mat[1] = c * a01 + s * a11;
		this.mat[2] = c * a02 + s * a12;

		this.mat[3] = c * a10 - s * a00;
		this.mat[4] = c * a11 - s * a01;
		this.mat[5] = c * a12 - s * a02;
		
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

	public translate(x:number, y:number):Matrix
	{
		let a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2],
			a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], 
			a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8];

		this.mat[6] = x * a00 + y * a10 + a20;
		this.mat[7] = x * a01 + y * a11 + a21;
    	this.mat[8] = x * a02 + y * a12 + a22;

		return this;
	}

	public static fromRotation(rad:number, ref?:Matrix):Matrix
	{
		if (ref == undefined)
			ref = new Matrix();
		else
			ref.identity();
		
		var s = Math.sin(rad), c = Math.cos(rad);
		ref.mat[0] = c;
		ref.mat[1] = -s;
		ref.mat[3] = s;
		ref.mat[4] = c;
		return ref;
	}

	public static fromScale(x:number, y:number, ref?:Matrix):Matrix
	{
		if (ref == undefined)
			ref = new Matrix();
		else
			ref.identity();
		ref.mat[0] = x;
		ref.mat[4] = y;
		return ref;
	}

	public static fromTranslation(x:number, y:number, ref?:Matrix):Matrix
	{
		if (ref == undefined)
			ref = new Matrix();
		else
			ref.identity();
		ref.mat[6] = x;
		ref.mat[7] = y;
		return ref;
	}

}