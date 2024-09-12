import express from 'express';
import { convertToMp3, getMp4, downloadMp3 } from "./util";
  
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/convert', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // 获取视频文件.mp4和链接标题
    const mp4File = await getMp4(url);
    if (!mp4File?.url) {
      return res.status(404).json({ error: 'No MP4 link found' });
    }
    // 将上一步的.mp4转换成.mp3文件
    const mp3File = await convertToMp3(mp4File)

    // 服务端下载
    // const downloadedFilePath = await downloadMp3(mp3File, mp4File?.fileName);

    res.json({
      message: 'File converted and downloaded successfully',
      code: '200',
      result: {
        fileName: mp4File?.fileName,
        url: mp3File?.url
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during processing' });
  }
});
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
  