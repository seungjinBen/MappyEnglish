import '../../App.css';

function Header(){
    return(
        <header className='mappyHeader'>
            <div className="safe-padded" style={{paddingTop: 'max(var(--space-4), env(safe-area-inset-top))'}}>
                <div className="logo" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 0'}}>
                    <img src="/MappyLogo.png"alt="Mappy English Logo"
                        style={{ height: '100px', margin:'-30px 0 -30px 0' }} // 크기는 원하는 대로 조절
                    />
                </div>
            </div>
        </header>
    )
}
export default Header;