const content = `% 功能：
%   文件名称: remove_eda_from_emg_function.m
%   从肌电中去除皮肤电串扰的函数封装
% 参数：
%   emg: 肌电的数据
% 返回值：
%   result: 去除肌电后的结果
% 备注：
%

function result = remove_eda_from_emg_function (emg)
  L = length(emg);
  M = max(emg);
  m = min(emg);
  % 处理波峰
  threshold = m + 0.8 * (M - m); %设置阈值
  [pks, locs] = findpeaks(emg, 'MinPeakHeight', threshold);
  locs_offset_L = locs - 8; %左偏8个点
  locs_offset_R = locs + 18; %右偏18个点
  locs_offset_L(locs_offset_L < 1) = 1; %
  locs_offset_R(locs_offset_R > L) = L; %不能超过范围

  num_pks = length(locs_offset_L); %峰值点的个数，不包含0
  locs_offset_L = [1; locs_offset_L]; %
  locs_offset_R = [1; locs_offset_R]; %以0索引为基准位置

  for index = 1:num_pks

    if locs_offset_R(index) <= locs_offset_L(index + 1)
      seg_before = emg(locs_offset_R(index):locs_offset_L(index + 1)); %取出之前一段的数据
      %seg_before(isnan(seg_before)==1) = [];%去掉NaN
    else
      seg_before = emg(locs_offset_L(index + 1):locs_offset_R(index)); %取出之前一段的数据
      %seg_before(isnan(seg_before)==1) = [];%去掉NaN
    end

    mean_seg = mean(seg_before);
    std_seg = std(seg_before);

    if locs_offset_R(index + 1) <= L
      rand_sing = fix(std_seg * randn(locs_offset_R(index + 1) - locs_offset_L(index + 1) + 1, 1) + mean_seg);
      emg(locs_offset_L(index + 1):locs_offset_R(index + 1)) = rand_sing;
    else
      rand_sing = fix(std_seg * randn(L - locs_offset_L(index + 1) + 1, 1) + mean_seg);
      emg(locs_offset_L(index + 1):L) = rand_sing;
    end

  end

  % 处理波谷
  emg_neg = 0 - emg; %取反
  M_n = max(emg_neg);
  m_n = min(emg_neg);
  threshold_neg = m_n + 0.6 * (M_n - m_n);
  [pks_n, locs_n] = findpeaks(emg_neg, 'MinPeakHeight', threshold_neg);
  %pks_n = 0 - pks_n;
  locs_n_offset_L = locs_n - 18; %左偏18个点
  locs_n_offset_R = locs_n + 8; %右偏8个点
  locs_n_offset_L(locs_n_offset_L < 1) = 1; %
  locs_n_offset_R(locs_n_offset_R > L) = L; %不能超过范围

  num_pks_n = length(locs_n_offset_L); %峰值点的个数，不包含0
  locs_n_offset_L = [1; locs_n_offset_L]; %
  locs_n_offset_R = [1; locs_n_offset_R]; %以0索引为基准位置

  result = emg;


  for index = 1:num_pks_n

    if locs_n_offset_R(index) <= locs_n_offset_L(index + 1)
      seg_before = emg(locs_n_offset_R(index):locs_n_offset_L(index + 1)); %取出之前一段的数据
      seg_before(isnan(seg_before) == 1) = []; %去掉NaN
    else
      seg_before = emg(locs_n_offset_L(index + 1):locs_n_offset_R(index)); %取出之前一段的数据
      seg_before(isnan(seg_before) == 1) = []; %去掉NaN
    end

    mean_seg = mean(seg_before);
    std_seg = std(seg_before);

    if locs_n_offset_R(index + 1) <= L
      rand_sing = fix(std_seg * randn(locs_n_offset_R(index + 1) - locs_n_offset_L(index + 1) + 1, 1) + mean_seg);
      emg(locs_n_offset_L(index + 1):locs_n_offset_R(index + 1)) = rand_sing;
    else
      rand_sing = fix(std_seg * randn(L - locs_n_offset_L(index + 1) + 1, 1) + mean_seg);
      emg(locs_n_offset_L(index + 1):L) = rand_sing;
    end

  end


end
`
const name = 'emg'
import tool from './tool'
console.log(tool.getRangesByName(content, name));