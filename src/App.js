import './App.css';
import {useState} from "react";

function App() {

    //Функция выбора обработки изображения алгоритма gradient
    const [gradientAlgoType, setGradientAlgoType] = useState("sobel");

    const changeGradientAlgoType = (value) => {
        setGradientAlgoType(value);
    }

    //Функция выбора обработки изображения алгоритма contrast
    const [contrastGrayscale, setContrastGrayscale] = useState(false);

    //Выбор алгоритма gradient или contrast
    const [algoName, setAlgoName] = useState("contrast");

    const handleAlgoNameChange = (event) => {
        setAlgoName(event.target.value);
    }

    //get и set загружаемого изображения
    const [imgSrc, setImgSrc] = useState(null);

    //get и set значения color в алгоритме contrast
    const [valueMinMax, setValueMinMax] = useState(500);

    const onChangeValueMinMax = (event) => {
        setValueMinMax(event.target.value);
    }

    //Загружаемый файл
    const [uploadedFile, setUploadedFile] = useState("");

    //Функция обращения на сервер алгоритма contrast
    const applyContrast = () => {
        let formData = new FormData();
        formData.append('file', uploadedFile);
        fetch("https://localhost:7190/api/contrast?strContrast=" + valueMinMax + "&isGrayScale=" + contrastGrayscale, {
            body: formData,
            method: "POST"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setImgSrc(data.img);
        });
    }

    //Функция обращения на сервер алгоритма gradient
    const applyGradient = () => {
        let formData = new FormData();
        formData.append('file', uploadedFile);
        fetch("https://localhost:7190/api/gradient?algoType=" + gradientAlgoType, {
            body: formData,
            method: "POST"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setImgSrc(data.img);
        });
    }

    //Изображение
    function handleUploadedFileChange(e) {
        setUploadedFile(e.target.files[0]);
    }

    //Изменение изображения по установленному значению
    const sendData = () => {
        if (algoName === "contrast") {
            applyContrast();
        } else {
            applyGradient();
        }
    }

    return (
        <div>
            <>
                <div className="container">
                    <div className="row row_main">
                        <div className="col-8 col-md-8">
                            <div className="mb-3">
                                <label htmlFor="formFile" className="form-label">Выберите изображение для обработки</label>
                                <input className="form-control" type="file" onChange={handleUploadedFileChange} value={""}/>
                            </div>
                            <div className="img-container">
                                {imgSrc != null && <img alt="alttmp" style={{
                                    // width: "500px",
                                    // margin: "1rem"
                                }} src={`data:image/png;base64,${imgSrc}`}/>}
                            </div>
                        </div>
                        <div className="col-4 col-md-4">
                            <div>
                                <h3 className="h_select h3 text-muted">Выберите алгоритм</h3>
                                <select className="select form-select" value={algoName} onChange={handleAlgoNameChange}>
                                    <option value="contrast">contrast</option>
                                    <option value="gradient">gradient</option>
                                </select>
                            </div>
                            {algoName === "gradient" &&
                            <div className="div_gradient">
                                <h3 className="h_kernel h3 text-muted">Kernel</h3>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" onClick={() => changeGradientAlgoType("sobel")}
                                           checked={gradientAlgoType === "sobel"}/>
                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                            Sobel
                                        </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" onClick={() => changeGradientAlgoType("prewitt")}
                                           checked={gradientAlgoType === "prewitt"}/>
                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                        Prewitt
                                    </label>
                                </div>
                            </div>
                            }
                            {algoName === "contrast" &&
                            <div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" onClick={() => setContrastGrayscale(false)}
                                           checked={!contrastGrayscale}/>
                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                        Color
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" onClick={() => setContrastGrayscale(true)}
                                           checked={contrastGrayscale}/>
                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                        Grayscale
                                    </label>
                                </div>
                                <br/>
                                <input className="input_range form-range" type="range" min="0" max="1000" value={valueMinMax}
                                       onChange={onChangeValueMinMax}/>
                            </div>
                            }
                            <button className="btn btn-outline-primary" disabled={uploadedFile === null} onClick={sendData}>Отправить</button>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
}

export default App;
