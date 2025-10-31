/**
 * 将16进制颜色值转换为RGB格式
 * @param hex 16进制颜色值，支持带#和不带#的3位或6位格式
 * @returns RGB格式的字符串，如"255,255,255"
 * @throws 当输入的16进制值格式不正确时抛出错误
 */
export function hexToRgb(hex: string): string {
    // 移除可能存在的#号
    let cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    
    // 处理3位简写形式（如fff转换为ffffff）
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(char => char + char).join('');
    }
    
    // 验证格式是否正确
    if (!/^[0-9a-fA-F]{6}$/.test(cleanHex)) {
        throw new Error('无效的16进制颜色值');
    }
    
    // 提取RGB各分量
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    
    // 返回逗号分隔的RGB值
    return `${r},${g},${b}`;
}
